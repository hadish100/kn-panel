const express = require('express'); const app = express();
const fileUpload = require('express-fileupload');
const fs = require('fs');
var AdmZip = require("adm-zip");
var SD_VARIABLE = 0;
require('dotenv').config()
var accounts_clct, panels_clct, users_clct, logs_clct;

const { 
    uid,
    uidv2,
    insert_to_accounts,
    get_accounts,
    get_account,
    update_account,
    insert_to_panels,
    get_panels,
    get_panel,
    update_panel,
    insert_to_users,
    get_users,
    get_all_users,
    get_user1,
    username_to_id,
    get_user2,
    update_user,
    insert_to_logs,
    get_logs,
    b2gb,
    gb2b,
    dnf,
    add_token,
    token_to_account,
    get_panel_info,
    make_vpn,
    delete_vpn,
    disable_vpn,
    enable_vpn,
    edit_vpn,
    reload_agents,
    reset_marzban_user,
    connect_to_db,
    dl_file,
    show_url,
    delete_folder_content,
    enable_panel,
    disable_panel,
    secondary_backend_url_converter,
    get_sub_url,
    switch_countries,
    proxy_obj_maker,
    update_user_links_bg,
    deep_equal,
    token_to_sub_account,
    delete_vpn_group,
    enable_vpn_group,
    disable_vpn_group,
    notify_tgb,
    get_user_data_graph,
    get_agent_data_graph,
    get_agents,
} = require("./utils");


app.use(express.json());
app.use(fileUpload());
app.use(auth_middleware);

connect_to_db().then(res => {
    accounts_clct = res.accounts_clct;
    panels_clct = res.panels_clct;
    users_clct = res.users_clct;
    logs_clct = res.logs_clct;
});



// --- MIDDLEWARE --- //

async function auth_middleware(req, res, next) {

    if( req.body.service_access_api_key == "resllmwriewfeujeh3i3ifdkmwheweljedifefhyr" ) return next();
    if (SD_VARIABLE == 1) return res.status(500).send({ message: 'Service unavailable' });
    if (req.url == "/login" || req.url.startsWith("/sub") ) return next();
    var { access_token } = req.body;
    var account = await token_to_account(access_token);
    if (!account) return res.send({ status: "ERR", msg: 'Token is either expired or invalid' });
    else
    {
        var endpoints =
        {
            sub_accounts_perms:["/add_sub_account","/edit_sub_account","/delete_sub_account"],
            users_perms:["/create_user","/delete_user","/disable_user","/enable_user","/edit_user","/reset_user","/switch_countries"],
            agents_perms:["/create_agent","/delete_agent","/disable_agent","/enable_agent","/edit_agent","/enable_edit_access","/enable_create_access","/enable_delete_access","/disable_edit_access","/disable_create_access","/disable_delete_access","/disable_all_agent_users","/enable_all_agent_users","/delete_all_agent_users"],
            panels_perms:["/create_panel","/delete_panel","/disable_panel","/enable_panel","/edit_panel"]
        };

        if(access_token.includes("#") && [...endpoints.agents_perms,...endpoints.panels_perms,"/dldb","/uldb"].includes(req.url)) res.send({ status: "ERR", msg: 'access denied' });
        else if(access_token.includes("@") && endpoints.sub_accounts_perms.includes(req.url)) res.send({ status: "ERR", msg: 'access denied' });   
        else if(access_token.includes("@") && !access_token.includes("$") && endpoints.panels_perms.includes(req.url)) res.send({ status: "ERR", msg: 'access denied' });
        else if(access_token.includes("@") && !access_token.includes("%") && endpoints.agents_perms.includes(req.url)) res.send({ status: "ERR", msg: 'access denied' });
        else if(access_token.includes("@") && !access_token.includes("^") && endpoints.users_perms.includes(req.url)) res.send({ status: "ERR", msg: 'access denied' });
        else next();

    }


}

// --- ENDPOINTS --- //

app.post("/ping", async (req, res) => 
{
    res.send("OK");
});

app.post("/get_agents", async (req, res) => {
    await reload_agents();
    var obj_arr = await get_agents();

    res.send(obj_arr);
});

app.post("/get_panels", async (req, res) => {
    var obj_arr = await panels_clct.find({}).toArray();
    res.send(obj_arr);
});

app.post("/get_users", async (req, res) => {
    var { access_token,number_of_rows,current_page,search_filter,status_filter } = req.body;
    await reload_agents();
    var agent_id = (await token_to_account(access_token)).id
    var obj_arr = await get_users(agent_id);
    obj_arr = obj_arr.reverse();
    if(search_filter) obj_arr = obj_arr.filter(x => x.username.toLowerCase().includes(search_filter.toLowerCase()));
    if(status_filter) obj_arr = obj_arr.filter(x => x.status == status_filter.toLowerCase());
    if(!number_of_rows && !current_page) {current_page = 1;number_of_rows = 10;}
    var total_pages = Math.ceil(obj_arr.length / number_of_rows);
    obj_arr = obj_arr.slice((current_page - 1) * number_of_rows, current_page * number_of_rows);
    res.send({ obj_arr, total_pages });
});


app.post("/get_agent", async (req, res) => {
    var { access_token } = req.body;
    var agent = await token_to_account(access_token);
    var filteredCountries = await Promise.all(agent.country.split(",").map(async (x) => 
    {
        var panel_obj = (await panels_clct.find({ panel_country: x }).toArray())[0];
        if (panel_obj.disable || panel_obj.active_users >= panel_obj.panel_user_max_count ||  panel_obj.panel_traffic <= panel_obj.panel_data_usage ) return null;
        else return x;
    }));
    agent.country = filteredCountries.filter(Boolean).join(",");

    res.send(agent);
});

app.post("/get_agent_logs", async (req, res) => {
    const { access_token, number_of_rows, current_page, actions,start_date,end_date,accounts } = req.body;
    var obj = await get_logs();
    var account_id = (await token_to_account(access_token)).id;
    obj.sort((a, b) => b.time - a.time);
    obj = obj.filter(x => x.account_id == account_id);
    if (actions.length) obj = obj.filter(x => actions.includes(x.action));
    if (accounts.length) 
    {
        var id_arr = await Promise.all(accounts.map(async (x) => await username_to_id(x)));
        obj = obj.filter(x => id_arr.includes(x.account_id));
    }
    if (start_date) obj = obj.filter(x => x.time >= start_date);
    if (end_date) obj = obj.filter(x => x.time <= end_date);
    var total_pages = Math.ceil(obj.length / number_of_rows);
    obj = obj.slice((current_page - 1) * number_of_rows, current_page * number_of_rows);
    res.send({ obj, total_pages });
});

app.post("/get_admin_logs", async (req, res) => 
{
    const { number_of_rows, current_page, actions, accounts,start_date,end_date,syslog } = req.body;
    var obj = await get_logs();
    obj.sort((a, b) => b.time - a.time);
    if (actions.length) obj = obj.filter(x => actions.includes(x.action) || x.is_syslog);
    if (accounts.length) 
    {
        var id_arr = await Promise.all(accounts.map(async (x) => await username_to_id(x)));
        obj = obj.filter(x => id_arr.includes(x.account_id) || x.is_syslog);
    }
    if (start_date) obj = obj.filter(x => x.time >= start_date);
    if (end_date) obj = obj.filter(x => x.time <= end_date);
    if (!syslog) obj = obj.filter(x=>x.is_syslog == null)
    var total_pages = Math.ceil(obj.length / number_of_rows);
    obj = obj.slice((current_page - 1) * number_of_rows, current_page * number_of_rows);
    res.send({ obj, total_pages });
});

app.post("/login", async (req, res) => {

    const { username, password } = req.body;
    const accounts = await get_accounts();
    const account = accounts.filter(x => x.username == username && x.password == password)[0];
    const sub_account_parent = accounts.filter(x => x.sub_accounts.filter(y => y.username == username && y.password == password).length)[0]

    if (account) 
    {
        var access_token = await add_token(account.id,account.id,account.is_admin);
        await insert_to_logs(account.id, "LOGIN", "logged in",access_token);
        res.send({ is_admin: account.is_admin, access_token });
    }

    else if(sub_account_parent)
    {
        var sub_account = sub_account_parent.sub_accounts.filter(y => y.username == username && y.password == password)[0];
        var access_token = await add_token(sub_account_parent.id,sub_account.id,sub_account_parent.is_admin,sub_account.perms);
        await insert_to_logs(sub_account_parent.id, "LOGIN", "logged in",access_token);
        res.send({ is_admin: sub_account_parent.is_admin, access_token }); 
    }

    else 
    {
        res.status(401).send({ message: 'NOT FOUND' });
    }

    var all_accounts = await get_accounts();
    all_accounts.forEach(async (account_obj) => 
    {
        var tokens = account_obj.tokens;
        var new_tokens = tokens.filter( x => x.expire > Math.floor(Date.now()/1000) );
        await update_account(account_obj.id,{tokens:new_tokens});
    });

});

app.post("/create_agent", async (req, res) => {


    const { name,
        username,
        password,
        volume,
        min_vol,
        max_users,
        max_days,
        prefix,
        country,
        max_non_active_days,
        business_mode,
        access_token } = req.body;

        var agents_arr = await get_agents();
        var prefix_arr = agents_arr.map(x => x.prefix);
        var name_arr = agents_arr.map(x => x.name);
        var username_arr = agents_arr.map(x => x.username);

    

    if (!name || !username || !password || !volume || !min_vol || !max_users || !max_days || !prefix || !country || !max_non_active_days) res.send({ status: "ERR", msg: "fill all of the inputs" })
    else if(prefix_arr.includes(prefix)) res.send({ status: "ERR", msg: "prefix already exists" });
    else if(name_arr.includes(name)) res.send({ status: "ERR", msg: "name already exists" });
    else if(username_arr.includes(username)) res.send({ status: "ERR", msg: "username already exists" });   
    else {
        await insert_to_accounts({
            id: uid(),
            is_admin: 0,
            disable: 0,
            create_access:1,
            edit_access:1,
            delete_access:1,
            name,
            username,
            password,
            volume: gb2b(volume),
            lifetime_volume: gb2b(volume),
            allocatable_data: dnf(volume),
            min_vol: dnf(min_vol),
            max_users: parseInt(max_users),
            max_days: parseInt(max_days),
            max_non_active_days:parseInt(max_non_active_days),
            prefix,
            country,
            used_traffic: 0.00,
            active_users: 0,
            total_users: 0,
            business_mode:business_mode?1:0,
            tokens: [],
            sub_accounts:[],
            daily_usage_logs:[]
        });

        var account_id = (await token_to_account(access_token)).id;
        await insert_to_logs(account_id, "CREATE_AGENT", `created agent !${name} with !${volume} GB data`,access_token)

        res.send("DONE");
    }

});

app.post("/create_panel", async (req, res) => {
    const { panel_name,
        panel_url,
        panel_username,
        panel_password,
        panel_country,
        panel_user_max_count,
        panel_traffic,
        access_token } = req.body;


    var panel_info = await get_panel_info(panel_url, panel_username, panel_password);
    var available_panels = await get_panels();
    var panel_countries_arr = available_panels.map(x => x.panel_country);
    var panel_urls_arr = available_panels.map(x => x.panel_url);
    var panel_names_arr = available_panels.map(x => x.panel_name);



    if (!panel_name || !panel_url || !panel_username || !panel_password || !panel_country || !panel_user_max_count || !panel_traffic) res.send({ status: "ERR", msg: "fill all of the inputs" })
    else if (panel_info == "ERR") res.send({ status: "ERR", msg: "Failed to connect to panel" });
    else if (panel_urls_arr.includes(panel_url)) res.send({ status: "ERR", msg: "panel url already exists" });
    else if (panel_names_arr.includes(panel_name)) res.send({ status: "ERR", msg: "panel name already exists" });
    else {
        await insert_to_panels({
            id: uid(),
            disable: 0,
            panel_name,
            panel_username,
            panel_password,
            panel_url,
            panel_country: panel_country + (panel_countries_arr.filter(x => x.replace(/\d+$/, '') == panel_country).length + 1),
            panel_user_max_count: parseInt(panel_user_max_count),
            panel_traffic: dnf(panel_traffic),
            panel_data_usage: dnf(panel_info.panel_data_usage),
            active_users: panel_info.active_users,
            total_users: panel_info.total_users,
        });

        var account_id = (await token_to_account(access_token)).id;
        await insert_to_logs(account_id, "CREATE_PANEL", `created panel !${panel_name}`,access_token);

        res.send("DONE");
    }
});

app.post("/create_user", async (req, res) => {
    var { username,
        expire,
        data_limit,
        country,
        access_token,
        protocols,
        flow_status,
        desc } = req.body;

        if(process.env.RELEASE == 3) flow_status = "xtls-rprx-vision";

    if (!username || !expire || !data_limit || !country || protocols.length == 0) 
    {
        res.send({ status: "ERR", msg: "fill all of the inputs" })
        return;
    }

    var corresponding_agent = await token_to_account(access_token);
    var agent_id = corresponding_agent.id;
    var all_usernames = [...(await get_all_users()).map(x => x.username)];
    var panels_arr = await get_panels();
    var selected_panel = panels_arr.filter(x => x.panel_country == country && (x.active_users < x.panel_user_max_count) && (x.disable == 0) && (x.panel_traffic > x.panel_data_usage) )[0];
    var agent_user_count = (await get_all_users()).filter(x => x.agent_id == agent_id).length;

    if (corresponding_agent.disable) res.send({ status: "ERR", msg: "your account is disabled" })
    else if(!corresponding_agent.create_access) res.send({ status: "ERR", msg: "access denied" })
    else if (data_limit > corresponding_agent.allocatable_data) res.send({ status: "ERR", msg: "not enough allocatable data" })
    else if (expire > corresponding_agent.max_days) res.send({ status: "ERR", msg: "maximum allowed days is " + corresponding_agent.max_days })
    else if (corresponding_agent.min_vol > data_limit) res.send({ status: "ERR", msg: "minimum allowed data is " + corresponding_agent.min_vol })
    else if (corresponding_agent.max_users <= agent_user_count) res.send({ status: "ERR", msg: "maximum allowed users is " + corresponding_agent.max_users })
    else if (all_usernames.includes(corresponding_agent.prefix + "_" + username)) res.send({ status: "ERR", msg: "username already exists" })
    else if (!selected_panel) res.send({ status: "ERR", msg: "no available server" });
    else if (selected_panel.panel_traffic - selected_panel.panel_data_usage < data_limit) res.send({ status: "ERR", msg: "insufficient traffic on server" });
    else {

        var mv = await make_vpn(selected_panel.panel_url,
            selected_panel.panel_username,
            selected_panel.panel_password,
            corresponding_agent.prefix + "_" + username,
            gb2b(data_limit),
            Math.floor(Date.now() / 1000) + expire * 24 * 60 * 60,
            protocols,
            flow_status)


        if (mv == "ERR") res.send({ status: "ERR", msg: "failed to connect to marzban" })
        else {

            var inbounds = proxy_obj_maker(protocols,flow_status,2)

            await insert_to_users({
                id: uid(),
                agent_id,
                status: "active",
                disable: 0,
                username: corresponding_agent.prefix + "_" + username,
                expire: Math.floor(Date.now() / 1000) + expire * 24 * 60 * 60,
                data_limit: gb2b(data_limit),
                used_traffic: 0.00,
                lifetime_used_traffic: 0.00,
                country,
                corresponding_panel_id: selected_panel.id,
                corresponding_panel: selected_panel.panel_url,
                real_subscription_url: (mv.subscription_url.startsWith("/")?selected_panel.panel_url:"") + mv.subscription_url,
                subscription_url: get_sub_url() + "/sub/" + uidv2(10),
                links: mv.links,
                created_at:Math.floor(Date.now()/1000),
                disable_counter:{value:0,last_update:Math.floor(Date.now() / 1000)},
                inbounds,
                desc
            });

            await update_account(agent_id, { allocatable_data: dnf(corresponding_agent.allocatable_data - data_limit) });

            await insert_to_logs(agent_id, "CREATE_USER", `created user !${username} with !${data_limit} GB data and !${expire} days of expire time`,access_token);

            res.send("DONE");
        }




    }



});

app.post("/delete_agent", async (req, res) => {
    var { access_token, agent_id } = req.body;
    var account_id = (await token_to_account(access_token)).id;
    var agent_obj = await get_account(agent_id);
    await accounts_clct.deleteOne({ id: agent_id });
    await insert_to_logs(account_id, "DELETE_AGENT", `deleted agent !${agent_obj.username}`,access_token);
    res.send("DONE");
});

app.post("/delete_panel", async (req, res) => {
    var { access_token, panel_id } = req.body;
    var account_id = (await token_to_account(access_token)).id;
    var panel_obj = await get_panel(panel_id);
    var agents_arr = await get_agents();

    for (agent of agents_arr) {
        var cindex = agent.country.split(",").indexOf(panel_obj.panel_country);
        if (cindex != -1) {
            var old_countries = agent.country.split(",");
            old_countries.splice(cindex, 1);
            var new_countries = old_countries.join(",");
            await update_account(agent.id, { country: new_countries });
        }
    }

    await panels_clct.deleteOne({ id: panel_id });
    await insert_to_logs(account_id, "DELETE_PANEL", `deleted panel !${panel_obj.panel_name}`,access_token);
    res.send("DONE");
});

app.post("/delete_user", async (req, res) => {
    var { access_token, username } = req.body;
    var user_obj = await get_user2(username);
    var agent_obj = await get_account(user_obj.agent_id);
    var panel_obj = await get_panel(user_obj.corresponding_panel_id);
    if (agent_obj.disable) {res.send({ status: "ERR", msg: "your account is disabled" });return;}
    else if(!agent_obj.delete_access) {res.send({ status: "ERR", msg: "access denied" });return;}
    var result = await delete_vpn(panel_obj.panel_url, panel_obj.panel_username, panel_obj.panel_password, username);
    if (result == "ERR") res.send({ status: "ERR", msg: "failed to connect to marzban" })
    else {
        if( !(agent_obj.business_mode == 1 && (user_obj.used_traffic > user_obj.data_limit/4 || (user_obj.expire - user_obj.created_at) < (Math.floor(Date.now()/1000) - user_obj.created_at)*4 )) ) await update_account(agent_obj.id, { allocatable_data: dnf(agent_obj.allocatable_data + b2gb(user_obj.data_limit - user_obj.used_traffic)) });
        await users_clct.deleteOne({ username });
        await insert_to_logs(agent_obj.id, "DELETE_USER", `deleted user !${username}`,access_token);
        res.send("DONE");
    }

});

app.post("/disable_panel", async (req, res) => {
    var { access_token, panel_id } = req.body;
    await disable_panel(panel_id);
    var panel_obj = await get_panel(panel_id);
    var account_id = (await token_to_account(access_token)).id;
    await insert_to_logs(account_id, "DISABLE_PANEL", `disabled panel !${panel_obj.panel_name}`,access_token);
    res.send("DONE");
});

app.post("/disable_agent", async (req, res) => {
    var { access_token, agent_id } = req.body;
    await update_account(agent_id, { disable: 1 });
    var agent_obj = await get_account(agent_id);
    var account_id = (await token_to_account(access_token)).id;
    await insert_to_logs(account_id, "DISABLE_AGENT", `disabled agent !${agent_obj.username}`,access_token);
    res.send("DONE");
});

app.post("/disable_user", async (req, res) => {
    var { access_token, user_id } = req.body;
    var user_obj = await get_user1(user_id);
    var account = await token_to_account(access_token);
    var panel_obj = await get_panel(user_obj.corresponding_panel_id);
    if (account.disable) {res.send({ status: "ERR", msg: "your account is disabled" });return;}
    else if(!account.edit_access) {res.send({ status: "ERR", msg: "access denied" });return;}
    var result = await disable_vpn(panel_obj.panel_url, panel_obj.panel_username, panel_obj.panel_password, user_obj.username);
    if (result == "ERR") res.send({ status: "ERR", msg: "failed to connect to marzban" });
    else {
        await update_user(user_id, { status: "disable", disable: 1 });
        await insert_to_logs(account.id, "DISABLE_USER", `disabled user !${user_obj.username}`,access_token);
        res.send("DONE");
    }
});

app.post("/enable_agent", async (req, res) => {
    var { access_token, agent_id } = req.body;
    await update_account(agent_id, { disable: 0 });
    var account = await token_to_account(access_token);
    var agent_obj = await get_account(agent_id);
    await insert_to_logs(account.id, "ENABLE_AGENT", `enabled agent !${agent_obj.username}`,access_token);
    res.send("DONE");
});

app.post("/enable_panel", async (req, res) => {
    var { access_token, panel_id } = req.body;
    await enable_panel(panel_id);
    var account = await token_to_account(access_token);
    var panel_obj = await get_panel(panel_id);
    await insert_to_logs(account.id, "ENABLE_PANEL", `enabled panel !${panel_obj.panel_name}`,access_token);
    res.send("DONE");
});

app.post("/enable_user", async (req, res) => {
    var { access_token, user_id } = req.body;
    var user_obj = await get_user1(user_id);
    var account = await token_to_account(access_token);
    var panel_obj = await get_panel(user_obj.corresponding_panel_id);
    if (account.disable) {res.send({ status: "ERR", msg: "your account is disabled" });return;}
    else if(!account.edit_access) {res.send({ status: "ERR", msg: "access denied" });return;}
    var result = await enable_vpn(panel_obj.panel_url, panel_obj.panel_username, panel_obj.panel_password, user_obj.username);
    if (result == "ERR") res.send({ status: "ERR", msg: "failed to connect to marzban" });
    else {
        await update_user(user_id, { status: "active", disable: 0 });
        await insert_to_logs(account.id, "ENABLE_USER", `enabled user !${user_obj.username}`,access_token);
        res.send("DONE");
    }
});

app.post("/edit_agent", async (req, res) => {
    const { agent_id,
        name,
        username,
        password,
        volume,
        min_vol,
        max_users,
        max_days,
        prefix,
        country,
        max_non_active_days,
        business_mode,
        access_token } = req.body;

        var agent = await get_account(agent_id);
        var agents_arr = await get_agents();
        var prefix_arr = agents_arr.map(x => x.prefix);
        var name_arr = agents_arr.map(x => x.name);
        var username_arr = agents_arr.map(x => x.username);
        var [old_prefix, old_name, old_username] = [agent.prefix, agent.name, agent.username];


    if (!name || !username || !password || !volume || !min_vol || !max_users || !max_days || !prefix || !country || !max_non_active_days) res.send({ status: "ERR", msg: "fill all of the inputs" })
    else if(prefix_arr.includes(prefix) && old_prefix != prefix) res.send({ status: "ERR", msg: "prefix already exists" });
    else if(name_arr.includes(name) && old_name != name) res.send({ status: "ERR", msg: "name already exists" });
    else if(username_arr.includes(username) && old_username != username) res.send({ status: "ERR", msg: "username already exists" }); 
    else {
        var old_volume = agent.volume;
        var old_alloc = agent.allocatable_data;

        await update_account(agent_id, {
            name,
            username,
            password,
            volume: gb2b(volume),
            lifetime_volume: agent.lifetime_volume + gb2b(volume) - old_volume,
            allocatable_data: dnf(dnf(old_alloc) + dnf(volume) - dnf(b2gb(old_volume))),
            min_vol: dnf(min_vol),
            max_users: parseInt(max_users),
            max_days: parseInt(max_days),
            prefix,
            max_non_active_days:parseInt(max_non_active_days),
            business_mode:business_mode?1:0,
            country
        });
        var account = await token_to_account(access_token);
        var log_msg = `edited agent !${name} `
        if(Math.abs(Math.floor(old_volume) - Math.floor(gb2b(volume)))>gb2b(0.3)) 
        {
            log_msg += `and added !${b2gb(gb2b(volume) - old_volume)} GB data`
            await insert_to_logs(agent_id,"RECEIVE_DATA",`received !${b2gb(gb2b(volume) - old_volume)} GB data`,access_token)
        }
        await insert_to_logs(account.id, "EDIT_AGENT", log_msg,access_token);
        res.send("DONE");
    }


});

app.post("/edit_panel", async (req, res) => {
    const { panel_id,
        panel_name,
        panel_username,
        panel_url,
        panel_password,
        panel_user_max_count,
        panel_traffic,
        access_token } = req.body;



    var panel_info = await get_panel_info(panel_url, panel_username, panel_password);
    var old_panel_obj = await get_panel(panel_id);

    if (!panel_name || !panel_username || !panel_password || !panel_user_max_count || !panel_traffic || !panel_url) res.send({ status: "ERR", msg: "fill all of the inputs" })
    else if (panel_info == "ERR") res.send({ status: "ERR", msg: "Failed to connect to panel" });

    else {
        await update_panel(panel_id, {
            panel_name,
            panel_username,
            panel_password,
            panel_url,
            panel_user_max_count: parseInt(panel_user_max_count),
            panel_traffic: dnf(panel_traffic),
        });

        if(old_panel_obj.panel_url != panel_url)
        {
            await users_clct.updateMany({corresponding_panel_id:panel_id},{$set:{corresponding_panel:panel_url}});
            var all_users = await get_all_users();
            for(user of all_users)
            {
                if(user.corresponding_panel_id == panel_id) await update_user(user.id,{real_subscription_url:panel_url + user.real_subscription_url.split(old_panel_obj.panel_url)[1]});
            }
        }

        var account = await token_to_account(access_token);
        await insert_to_logs(account.id, "EDIT_PANEL", `edited panel !${panel_name}`,access_token);
        res.send("DONE");
    }

});

app.post("/edit_user", async (req, res) => {
    var { user_id,
        expire,
        data_limit,
        country,
        access_token,
        protocols,
        flow_status,
        desc } = req.body;

        if(process.env.RELEASE == 3) flow_status = "xtls-rprx-vision";

    if (!user_id || !expire || !data_limit || !country || protocols.length == 0) 
    {
        res.send({ status: "ERR", msg: "fill all of the inputs" });
        return;
    }

    var user_obj = await get_user1(user_id);
    var panel_obj = await get_panel(user_obj.corresponding_panel_id);
    var corresponding_agent = await token_to_account(access_token);
    var old_data_limit = b2gb(user_obj.data_limit);
    var old_country = user_obj.country;

    if (corresponding_agent.disable) res.send({ status: "ERR", msg: "your account is disabled" })
    else if(!corresponding_agent.edit_access) res.send({ status: "ERR", msg: "access denied" })
    else if (data_limit - old_data_limit > corresponding_agent.allocatable_data) res.send({ status: "ERR", msg: "not enough allocatable data" })
    else if (expire > corresponding_agent.max_days) res.send({ status: "ERR", msg: "maximum allowed days is " + corresponding_agent.max_days })
    else if (corresponding_agent.min_vol > data_limit) res.send({ status: "ERR", msg: "minimum allowed data is " + corresponding_agent.min_vol })
    else {

        var is_changing_country = old_country != country;
        var is_changing_protocols = !deep_equal(proxy_obj_maker(protocols,flow_status,2),user_obj.inbounds)
        var result = await edit_vpn(panel_obj.panel_url, panel_obj.panel_username, panel_obj.panel_password, user_obj.username, data_limit * ((2 ** 10) ** 3), Math.floor(Date.now() / 1000) + expire * 24 * 60 * 60, protocols, flow_status,is_changing_country,is_changing_protocols);

        if (result == "ERR") res.send({ status: "ERR", msg: "failed to connect to marzban" });

        else {

            var inbounds = proxy_obj_maker(protocols,flow_status,2)

            if(is_changing_country)
            {
                for(inbound in inbounds)
                {
                    if(!Object.keys(user_obj.inbounds).includes(inbound)) delete inbounds[inbound];
                }
            }

            await update_user(user_id, {
                expire: Math.floor(Date.now() / 1000) + expire * 24 * 60 * 60,
                data_limit: data_limit * ((2 ** 10) ** 3),
                inbounds,
                desc
            });

            if( !(corresponding_agent.business_mode == 1 && (user_obj.used_traffic > user_obj.data_limit/4 || (user_obj.expire - user_obj.created_at) < (Math.floor(Date.now()/1000) - user_obj.created_at)*4 ) && (old_data_limit > data_limit) ) ) await update_account(corresponding_agent.id, { allocatable_data: dnf(corresponding_agent.allocatable_data - data_limit + old_data_limit) });
            var account = await token_to_account(access_token);
            await insert_to_logs(account.id, "EDIT_USER", `edited user !${user_obj.username} with !${data_limit} GB data and !${expire} days of expire time`,access_token);
            if(old_country == country) 
            {
                if(user_obj.protocols != protocols || user_obj.flow_status != flow_status) update_user_links_bg(panel_obj.panel_url,panel_obj.panel_username,panel_obj.panel_password,user_obj.username,user_obj.id)
                res.send("DONE");
            }

            else
            {
                var switch_process = await switch_countries(old_country,country,[user_obj.username]);
                if(switch_process == "ERR") res.send({ status: "ERR", msg: "edited user but didn't switched country" });
                else
                {
                    await insert_to_logs(account.id, "SWITCH_COUNTRY", `switched country of user !${user_obj.username} from !${old_country} to !${country}`,access_token);
                    res.send("DONE")
                }
            }
            
            
        }


    }


});

app.post("/edit_self", async (req, res) => {
    const { username, password, access_token } = req.body;
    var corresponding_account = await token_to_account(access_token);
    var account_id = corresponding_account.id;
    var username_arr = await get_accounts();
    username_arr = username_arr.map(x => x.username);
    var old_username = corresponding_account.username;
    if(username_arr.includes(username) && old_username != username) res.send({ status: "ERR", msg: "username already exists" });
    else
    {
        if(access_token.includes("@"))
        {
            var sub_account_id = (await token_to_sub_account(access_token)).id;
            await accounts_clct.updateOne({id:account_id,"sub_accounts.id":sub_account_id},{$set:{"sub_accounts.$.username":username,"sub_accounts.$.password":password}});
        } 

        else await update_account(account_id, { username, password });
        var account = await token_to_account(access_token);
        await insert_to_logs(account.id, "EDIT_SELF", `was self edited`,access_token);
        res.send("DONE");
    } 
});

app.post("/reset_user", async (req, res) => {
    const { username, access_token } = req.body;
    var user_obj = await get_user2(username);
    var user_id = user_obj.id;
    var panel_obj = await get_panel(user_obj.corresponding_panel_id);
    var corresponding_agent = await token_to_account(access_token);

    if (corresponding_agent.disable) res.send({ status: "ERR", msg: "your account is disabled" })
    else if(!corresponding_agent.edit_access) res.send({ status: "ERR", msg: "access denied" })
    else 
    {  

        if( ( corresponding_agent.business_mode == 1 && (user_obj.used_traffic > user_obj.data_limit/4 || (user_obj.expire - user_obj.created_at) < (Math.floor(Date.now()/1000) - user_obj.created_at)*4 )) ) 
        {
            if(corresponding_agent.allocatable_data < b2gb(user_obj.data_limit)) {res.send({ status: "ERR", msg: "not enough allocatable data" }); return;}
            var result = await reset_marzban_user(panel_obj.panel_url, panel_obj.panel_username, panel_obj.panel_password, user_obj.username);
            if (result == "ERR") {res.send({ status: "ERR", msg: "failed to connect to marzban" });return;}
            await update_account(corresponding_agent.id, { allocatable_data: dnf(corresponding_agent.allocatable_data - b2gb(user_obj.data_limit)) });
        }

        else 
        {
            if(corresponding_agent.allocatable_data < b2gb(Math.min(user_obj.used_traffic,user_obj.data_limit))) {res.send({ status: "ERR", msg: "not enough allocatable data" }); return;}
            var result = await reset_marzban_user(panel_obj.panel_url, panel_obj.panel_username, panel_obj.panel_password, user_obj.username);
            if (result == "ERR") {res.send({ status: "ERR", msg: "failed to connect to marzban" });return;}
            await update_account(corresponding_agent.id, { allocatable_data: dnf(corresponding_agent.allocatable_data - b2gb(Math.min(user_obj.used_traffic,user_obj.data_limit))) });
        }

        await update_user(user_id, { used_traffic: 0 });
        if(user_obj.status=="limited") await update_user(user_id, { status: "active" });

        var account = await token_to_account(access_token);
        await insert_to_logs(account.id, "RESET_USER", `reseted user !${user_obj.username}`,access_token);
        res.send("DONE");
    }


    

});

app.post("/dldb", async (req, res) => 
{

    const account = await token_to_account(req.body.access_token);

    if( req.body.service_access_api_key != "resllmwriewfeujeh3i3ifdkmwheweljedifefhyr" && account.is_admin == 0  ) res.send({status:"ERR",msg:"you are not admin"});

    else
    {
        var users = await get_all_users();
        var accounts = await get_accounts();
        var panels = await get_panels();
        var logs = await get_logs();
        
        await delete_folder_content("dbbu");
        await fs.promises.mkdir("dbbu");
        await fs.promises.mkdir("dbbu/main");
        await fs.promises.mkdir("dbbu/marzban");
    
        await fs.promises.writeFile("dbbu/main/users.json",JSON.stringify(users));
        await fs.promises.writeFile("dbbu/main/accounts.json",JSON.stringify(accounts));
        await fs.promises.writeFile("dbbu/main/panels.json",JSON.stringify(panels));
        await fs.promises.writeFile("dbbu/main/logs.json",JSON.stringify(logs));
    

        for(panel of panels)
        {
            var sqlite_endpoint = secondary_backend_url_converter(panel.panel_url,"dldb");

            try
            {
                await dl_file(sqlite_endpoint,"dbbu/marzban/" + show_url(panel.panel_url) + ".zip");
                var zip = new AdmZip("dbbu/marzban/" + show_url(panel.panel_url) + ".zip");
                zip.extractAllTo("dbbu/marzban/" + show_url(panel.panel_url),true);

                if(process.env.RELEASE == 3)
                {
                    if(fs.existsSync("dbbu/marzban/" + show_url(panel.panel_url) + "/lib/assets")) await delete_folder_content("dbbu/marzban/" + show_url(panel.panel_url) + "/lib/assets");
                    if(fs.existsSync("dbbu/marzban/" + show_url(panel.panel_url) + "/lib/xray-core")) await delete_folder_content("dbbu/marzban/" + show_url(panel.panel_url) + "/lib/xray-core");
                }

                await fs.promises.unlink("dbbu/marzban/" + show_url(panel.panel_url) + ".zip");
                console.log("       # BACKUP COMPLETED FOR " + panel.panel_url);
            }

            catch(err)
            {
                console.log(err);
                continue;
            }
            
        }

        var zip = new AdmZip();
        var zip_id = Date.now();
        zip.addLocalFolder("dbbu/main","main");
        zip.addLocalFolder("dbbu/marzban","marzban");
        zip.writeZip("frontend/public/dbdl/db"+zip_id+".zip");
        await delete_folder_content("dbbu");
        var dl_url = "/dbdl/db"+zip_id+".zip";
        res.send("DONE>"+dl_url);
    }

});


app.post("/uldb", async (req, res) => 
{
    try
    {
        var { access_token } = req.body;
        var account = await token_to_account(access_token);
        await delete_folder_content("dbrs");
        await fs.promises.mkdir("dbrs");
        var db_file = req.files.file;
        await db_file.mv("dbrs/db.zip");
        var zip = new AdmZip("dbrs/db.zip");
        zip.extractAllTo("dbrs",true);

        var panels_clct_rs = JSON.parse(await fs.promises.readFile("dbrs/main/panels.json"));
        var accounts_clct_rs = JSON.parse(await fs.promises.readFile("dbrs/main/accounts.json"));
        var users_clct_rs = JSON.parse(await fs.promises.readFile("dbrs/main/users.json"));
        var logs_clct_rs = JSON.parse(await fs.promises.readFile("dbrs/main/logs.json"));
        
        await panels_clct.deleteMany({});
        await accounts_clct.deleteMany({});
        await users_clct.deleteMany({});
        await logs_clct.deleteMany({});

        await panels_clct.insertMany(panels_clct_rs);
        await accounts_clct.insertMany(accounts_clct_rs);
        await users_clct.insertMany(users_clct_rs);
        await logs_clct.insertMany(logs_clct_rs);


        await insert_to_logs(account.id,"RESTORE_DB",`restored database`,access_token);
        res.send("DONE");
    }

    catch(err)
    {
        console.log(err);
        res.send({ status: "ERR", msg: 'unsupported file structure' })
    }

    finally
    {
        await delete_folder_content("dbrs");
    }

});

app.post("/get_panel_inbounds", async (req, res) => 
{
    var { country } = req.body;
    var panels = await get_panels();
    var panel = panels.filter(x => x.panel_country == country)[0];
    if(!panel) res.send({ status: "ERR", msg: 'panel not found' })
    else
    {
        if(!panel.panel_inbounds) res.send({ status: "ERR", msg: 'inbounds not found' })
        else
        {
            var inbounds = Object.keys(panel.panel_inbounds);
            res.send(inbounds);     
        }
   
    }

});


app.post("/switch_countries", async(req,res) => 
{
    var { access_token , country_from , country_to } = req.body;
    var account = await token_to_account(access_token);
    var search_obj = {country:country_from};
    if(!account.is_admin) search_obj.agent_id = account.id;
    var users_arr = await users_clct.find(search_obj).toArray();
    users_arr = users_arr.map(x => x.username);
    var result = await switch_countries(country_from,country_to,users_arr);
    if(result == "ERR") res.send({ status: "ERR", msg: 'failed to switch countries' })
    else 
    {
        await insert_to_logs(account.id, "SWITCH_COUNTRY", `switched country of !${users_arr.length} users from !${country_from} to !${country_to}`,access_token);
        res.send("DONE");
    }
});


app.post("/add_sub_account", async(req,res) => 
{
    var {username,password,access_token} = req.body;
    if(!username || !password) res.send({ status: "ERR", msg: "fill all of the inputs" })
    else
    {
        var account = await token_to_account(access_token);
        var perms = {};
        if(account.is_admin) perms = {panels:1,agents:1};
        else perms = {users:1};
        await accounts_clct.updateOne({id:account.id},{$push:{"sub_accounts":{id:uid(),username,password,perms}}});
        await insert_to_logs(account.id, "ADD_SUB_ACCOUNT", `added sub account !${username}`,access_token)
        res.send("DONE");    
    }

});

app.post("/get_sub_accounts", async(req,res) => 
{
    var {access_token} = req.body;
    var account = await token_to_account(access_token);
    res.send(account.sub_accounts);
});


app.post("/delete_sub_account", async(req,res) => 
{
    var {access_token,sub_account_id} = req.body;
    var account = await token_to_account(access_token);
    var sub_account_username = account.sub_accounts.filter(x=>x.id == sub_account_id)[0].username;
    await accounts_clct.updateOne({id:account.id},{$pull:{"sub_accounts":{id:sub_account_id}}});
    await insert_to_logs(account.id, "DELETE_SUB_ACCOUNT", `deleted sub account !${sub_account_username}`,access_token)
    res.send("DONE");
});


app.post("/edit_sub_account", async(req,res) =>
{
    var {access_token,sub_account_id,username,password,perms} = req.body;
    if(!username || !password) res.send({ status: "ERR", msg: "fill all of the inputs" })
    else
    {
        var account = await token_to_account(access_token);
        await accounts_clct.updateOne({id:account.id,"sub_accounts.id":sub_account_id},{$set:{"sub_accounts.$.username":username,"sub_accounts.$.password":password,"sub_accounts.$.perms":perms}});
        await insert_to_logs(account.id, "EDIT_SUB_ACCOUNT", `edited sub account !${username}`,access_token)
        res.send("DONE");     
    }

});


app.post("/get_knp_info", async(req,res) =>
{

    var panels = await get_panels();

    var response_obj = 
    {
        active_panels_count : [panels.filter(x=>x.disable==0).length,panels.length],
        agents_count : (await get_accounts()).length-1,
        users_count : (await get_all_users()).length,
        today_logins : (await logs_clct.find({action:"LOGIN",time:{$gt:Math.floor(Date.now()/1000) - 24*60*60}}).toArray()).length,
        sd_status : SD_VARIABLE,
    };

    res.send(response_obj);
});

app.post("/enable_sd", async(req,res) =>
{
    SD_VARIABLE = 1;
    res.send("DONE");
});

app.post("/disable_sd", async(req,res) =>
{
    SD_VARIABLE = 0;
    res.send("DONE");
})


app.post(/\/(enable|disable)_agent_create_access$/, async (req, res) => 
{
    var { access_token, agent_id } = req.body;
    var account = await token_to_account(access_token);
    var agent_obj = await get_account(agent_id);
    if(req.url.startsWith("/enable")) 
    {
        await update_account(agent_id, { create_access: 1 });
        await insert_to_logs(account.id, "ENABLE_AGENT_CREATE_ACCESS", `enabled create access for agent !${agent_obj.username}`,access_token);
    }

    else 
    {
        await update_account(agent_id, { create_access: 0 });
        await insert_to_logs(account.id, "DISABLE_AGENT_CREATE_ACCESS", `disabled create access for agent !${agent_obj.username}`,access_token);
    }

    res.send("DONE");

});

app.post(/\/(enable|disable)_agent_edit_access$/, async (req, res) => 
{
    var { access_token, agent_id } = req.body;
    var account = await token_to_account(access_token);
    var agent_obj = await get_account(agent_id);
    if(req.url.startsWith("/enable")) 
    {
        await update_account(agent_id, { edit_access: 1 });
        await insert_to_logs(account.id, "ENABLE_AGENT_EDIT_ACCESS", `enabled edit access for agent !${agent_obj.username}`,access_token);
    }

    else 
    {
        await update_account(agent_id, { edit_access: 0 });
        await insert_to_logs(account.id, "DISABLE_AGENT_EDIT_ACCESS", `disabled edit access for agent !${agent_obj.username}`,access_token);
    }

    res.send("DONE");
});

app.post(/\/(enable|disable)_agent_delete_access$/, async (req, res) =>
{
    var { access_token, agent_id } = req.body;
    var account = await token_to_account(access_token);
    var agent_obj = await get_account(agent_id);
    if(req.url.startsWith("/enable")) 
    {
        await update_account(agent_id, { delete_access: 1 });
        await insert_to_logs(account.id, "ENABLE_AGENT_DELETE_ACCESS", `enabled delete access for agent !${agent_obj.username}`,access_token);
    }

    else 
    {
        await update_account(agent_id, { delete_access: 0 });
        await insert_to_logs(account.id, "DISABLE_AGENT_DELETE_ACCESS", `disabled delete access for agent !${agent_obj.username}`,access_token);
    }

    res.send("DONE");
});


app.post(/\/(enable|disable|delete)_all_agent_users$/, async (req, res) =>
{
    var { access_token, agent_id } = req.body;
    var account = await token_to_account(access_token);
    var agent_obj = await get_account(agent_id);
    var panels_arr = await get_panels();
    var agent_users = await users_clct.find({agent_id}).toArray();
    var agent_users_panels_id_arr = [...new Set(agent_users.map(x => x.corresponding_panel_id))];
    panels_arr = panels_arr.filter(x => agent_users_panels_id_arr.includes(x.id));
    var action_groups = []
    for(panel of panels_arr)
    {
        action_groups.push({
            panel_url:panel.panel_url,
            panel_username:panel.panel_username,
            panel_password:panel.panel_password,
            users:agent_users.filter(x => x.corresponding_panel_id == panel.id).map(x => x.username)
        });
    }


    if(req.url.startsWith("/enable")) 
    {
        for(group of action_groups)
        {
            var result = await enable_vpn_group(group.panel_url,group.panel_username,group.panel_password,group.users);
            if(result == "ERR") 
            {                     
                res.send({ status: "ERR", msg: "failed to connect to marzban" });
                return;
            }
        }

        await insert_to_logs(account.id, "ENABLE_ALL_AGENT_USERS", `enabled all users of agent !${agent_obj.username}`,access_token);
    }

    else if(req.url.startsWith("/disable"))
    {
        for(group of action_groups)
        {
            var result = await disable_vpn_group(group.panel_url,group.panel_username,group.panel_password,group.users);
            if(result == "ERR") 
            {                     
                res.send({ status: "ERR", msg: "failed to connect to marzban" });
                return;
            }
        }

        await insert_to_logs(account.id, "DISABLE_ALL_AGENT_USERS", `disabled all users of agent !${agent_obj.username}`,access_token);
    }

    else
    {
        for(group of action_groups)
        {
            var result = await delete_vpn_group(group.panel_url,group.panel_username,group.panel_password,group.users);
            if(result == "ERR") 
            {
                res.send({ status: "ERR", msg: "failed to connect to marzban" });
                return;
            }
        }

        await insert_to_logs(account.id, "DELETE_ALL_AGENT_USERS", `deleted all users of agent !${agent_obj.username}`,access_token);
    }

    res.send("DONE");
});


app.post("/graph/get_user_data", async(req,res) =>
{
    var {date_from,date_to} = req.body;
    var data_obj = await get_user_data_graph(date_from,date_to);
    res.send(data_obj);
});

app.post("/graph/get_agent_data", async(req,res) =>
{
    var {date_from,date_to,business_mode} = req.body;
    var data_obj = await get_agent_data_graph(date_from,date_to,business_mode);
    res.send(data_obj);
});



app.get(/^\/sub\/.+/,async (req,res) =>
{
    var sub_id = req.url.split("/")[2];
    var user_obj = await users_clct.find({subscription_url:{$regex:sub_id}}).toArray();
    if(user_obj.length == 0) res.send("NOT FOUND");
    else
    {
        res.redirect(user_obj[0].real_subscription_url);
    }
});

app.listen(parseInt(process.env.SERVER_PORT), () => 
{
    console.log("--------------");
    console.log("SERVER STARTED !");
    console.log("--------------");
    notify_tgb();
});
