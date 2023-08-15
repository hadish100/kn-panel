const express = require('express'); const app = express();
const axios = require('axios');
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://127.0.0.1:27017');

var accounts_clct, panels_clct, users_clct, logs_clct;

const { 
    uid,
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
    connect_to_db
} = require("./utils");


app.use(express.json());
app.use(auth_middleware);

connect_to_db().then(res => {
    accounts_clct = res.accounts_clct;
    panels_clct = res.panels_clct;
    users_clct = res.users_clct;
    logs_clct = res.logs_clct;
});





// --- MIDDLEWARE --- //

async function auth_middleware(req, res, next) {

    if (req.url == "/login") return next();

    // var accounts = await get_accounts();
    // accounts.forEach(async (account) => 
    // {
    //     var tokens = account.tokens;
    //     var new_tokens = tokens.filter( x => x.expire > Math.floor(Date.now()/1000) );
    //     await update_account(account.id,{tokens:new_tokens});
    // });

    var { access_token } = req.body;
    var account = await token_to_account(access_token);
    if (!account) return res.send({ status: "ERR", msg: 'Token is either expired or invalid' });
    else return next();


}

// --- ENDPOINTS --- //

app.post("/get_agents", async (req, res) => {
    await reload_agents();
    var obj_arr = await accounts_clct.find({ is_admin: 0 }).toArray();

    res.send(obj_arr);
});

app.post("/get_panels", async (req, res) => {
    var obj_arr = await panels_clct.find({}).toArray();
    res.send(obj_arr);
});

app.post("/get_users", async (req, res) => {
    var { access_token,number_of_rows,current_page,search_filter } = req.body;
    await reload_agents();
    var agent_id = (await token_to_account(access_token)).id
    var obj_arr = await get_users(agent_id);
    obj_arr = obj_arr.reverse();
    if(search_filter) obj_arr = obj_arr.filter(x => x.username.includes(search_filter));
    if(!number_of_rows && !current_page) {current_page = 1;number_of_rows = 10;}
    var total_pages = Math.ceil(obj_arr.length / number_of_rows);
    obj_arr = obj_arr.slice((current_page - 1) * number_of_rows, current_page * number_of_rows);
    res.send({ obj_arr, total_pages });
});


app.post("/get_agent", async (req, res) => {
    var { access_token } = req.body;
    var agent = await token_to_account(access_token);
    res.send(agent);
});

app.post("/get_agent_logs", async (req, res) => {
    const { access_token, number_of_rows, current_page, actions,start_date,end_date } = req.body;
    var obj = await get_logs();
    var account_id = (await token_to_account(access_token)).id;
    obj.sort((a, b) => b.time - a.time);
    obj = obj.filter(x => x.account_id == account_id);
    if (actions.length) obj = obj.filter(x => actions.includes(x.action));
    if (start_date) obj = obj.filter(x => x.time >= start_date);
    if (end_date) obj = obj.filter(x => x.time <= end_date);
    var total_pages = Math.ceil(obj.length / number_of_rows);
    obj = obj.slice((current_page - 1) * number_of_rows, current_page * number_of_rows);
    res.send({ obj, total_pages });
});

app.post("/get_admin_logs", async (req, res) => 
{
    const { number_of_rows, current_page, actions, accounts,start_date,end_date } = req.body;
    var obj = await get_logs();
    obj.sort((a, b) => b.time - a.time);
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

app.post("/login", async (req, res) => {

    const { username, password } = req.body;
    const accounts = await get_accounts();
    const account = accounts.filter(x => x.username == username && x.password == password)[0];

    if (account) {
        var access_token = await add_token(account.id);
        await insert_to_logs(account.id, "LOGIN", "logged in");
        res.send({ is_admin: account.is_admin, access_token });
    }

    else {
        res.status(401).send({ message: 'NOT FOUND' });
    }

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

        var agents_arr = await accounts_clct.find({ is_admin: 0 }).toArray();
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
            name,
            username,
            password,
            volume: gb2b(volume),
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
            tokens: []
        });

        var account_id = (await token_to_account(access_token)).id;
        await insert_to_logs(account_id, "CREATE_AGENT", `created agent !${name} with !${volume} GB data`)

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
            panel_country: panel_country + (panel_countries_arr.filter(x => x == panel_country).length + 1),
            panel_user_max_count: parseInt(panel_user_max_count),
            panel_traffic: dnf(panel_traffic),
            panel_data_usage: dnf(panel_info.panel_data_usage),
            active_users: panel_info.active_users,
            total_users: panel_info.total_users,
        });

        var account_id = (await token_to_account(access_token)).id;
        await insert_to_logs(account_id, "CREATE_PANEL", `created panel !${panel_name}`);

        res.send("DONE");
    }
});

app.post("/create_user", async (req, res) => {
    const { username,
        expire,
        data_limit,
        country,
        access_token } = req.body;

    if (!username || !expire || !data_limit || !country) res.send({ status: "ERR", msg: "fill all of the inputs" })

    var corresponding_agent = await token_to_account(access_token);
    var agent_id = corresponding_agent.id;
    var all_usernames = [...(await get_all_users()).map(x => x.username)];
    var panels_arr = await get_panels();
    var selected_panel = panels_arr.filter(x => x.panel_country == country && (x.active_users < x.panel_user_max_count) && (x.disable == 0) && (x.panel_traffic > x.panel_data_usage) )[0];
    var agent_user_count = (await get_all_users()).filter(x => x.agent_id == agent_id).length;

    if (corresponding_agent.disable) res.send({ status: "ERR", msg: "your account is disabled" })
    else if (data_limit > corresponding_agent.allocatable_data) res.send({ status: "ERR", msg: "not enough allocatable data" })
    else if (expire > corresponding_agent.max_days) res.send({ status: "ERR", msg: "maximum allowed days is " + corresponding_agent.max_days })
    else if (corresponding_agent.min_vol > data_limit) res.send({ status: "ERR", msg: "minimum allowed data is " + corresponding_agent.min_vol })
    else if (corresponding_agent.max_users <= agent_user_count) res.send({ status: "ERR", msg: "maximum allowed users is " + corresponding_agent.max_users })
    else if (all_usernames.includes(corresponding_agent.prefix + "_" + username)) res.send({ status: "ERR", msg: "username already exists" })
    else if (!selected_panel) res.send({ status: "ERR", msg: "no available server" });
    else {

        var mv = await make_vpn(selected_panel.panel_url,
            selected_panel.panel_username,
            selected_panel.panel_password,
            corresponding_agent.prefix + "_" + username,
            gb2b(data_limit),
            Math.floor(Date.now() / 1000) + expire * 24 * 60 * 60)

        if (mv == "ERR") res.send({ status: "ERR", msg: "failed to connect to marzban" })
        else {
            await insert_to_users({
                id: uid(),
                agent_id,
                status: "active",
                disable: 0,
                username: corresponding_agent.prefix + "_" + username,
                expire: Math.floor(Date.now() / 1000) + expire * 24 * 60 * 60,
                data_limit: gb2b(data_limit),
                used_traffic: 0.00,
                country,
                corresponding_panel_id: selected_panel.id,
                corresponding_panel: selected_panel.panel_url,
                subscription_url: selected_panel.panel_url + mv.subscription_url,
                links: mv.links,
                created_at:Math.floor(Date.now()/1000),
                disable_counter:{value:0,last_update:Math.floor(Date.now() / 1000)}
            });

            await update_account(agent_id, { allocatable_data: dnf(corresponding_agent.allocatable_data - data_limit) });

            await insert_to_logs(agent_id, "CREATE_USER", `created user !${username} with !${data_limit} GB data and !${expire} days of expire time`);

            res.send("DONE");
        }




    }



});

app.post("/delete_agent", async (req, res) => {
    var { access_token, agent_id } = req.body;
    var account_id = (await token_to_account(access_token)).id;
    var agent_obj = await get_account(agent_id);
    await accounts_clct.deleteOne({ id: agent_id });
    await insert_to_logs(account_id, "DELETE_AGENT", `deleted agent !${agent_obj.username}`);
    res.send("DONE");
});

app.post("/delete_panel", async (req, res) => {
    var { access_token, panel_id } = req.body;
    var account_id = (await token_to_account(access_token)).id;
    var panel_obj = await get_panel(panel_id);
    var agents_arr = await accounts_clct.find({ is_admin: 0 }).toArray();

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
    await insert_to_logs(account_id, "DELETE_PANEL", `deleted panel !${panel_obj.panel_name}`);
    res.send("DONE");
});

app.post("/delete_user", async (req, res) => {
    var { access_token, username } = req.body;
    var user_obj = await get_user2(username);
    var agent_obj = await get_account(user_obj.agent_id);
    var panel_obj = await get_panel(user_obj.corresponding_panel_id);
    var result = await delete_vpn(panel_obj.panel_url, panel_obj.panel_username, panel_obj.panel_password, username);
    if (result == "ERR") res.send({ status: "ERR", msg: "failed to connect to marzban" })
    else {
        if( !(agent_obj.business_mode == 1 && (user_obj.used_traffic > user_obj.data_limit/4 || (user_obj.expire - user_obj.created_at) < (Math.floor(Date.now()/1000) - user_obj.created_at)*4 )) ) await update_account(agent_obj.id, { allocatable_data: dnf(agent_obj.allocatable_data + b2gb(user_obj.data_limit - user_obj.used_traffic)) });
        await users_clct.deleteOne({ username });
        await insert_to_logs(agent_obj.id, "DELETE_USER", `deleted user !${username}`);
        res.send("DONE");
    }

});

app.post("/disable_panel", async (req, res) => {
    var { access_token, panel_id } = req.body;
    await update_panel(panel_id, { disable: 1 });
    var panel_obj = await get_panel(panel_id);
    var account_id = (await token_to_account(access_token)).id;
    await insert_to_logs(account_id, "DISABLE_PANEL", `disabled panel !${panel_obj.panel_name}`);
    res.send("DONE");
});

app.post("/disable_agent", async (req, res) => {
    var { access_token, agent_id } = req.body;
    await update_account(agent_id, { disable: 1 });
    var agent_obj = await get_account(agent_id);
    var account_id = (await token_to_account(access_token)).id;
    await insert_to_logs(account_id, "DISABLE_AGENT", `disabled agent !${agent_obj.username}`);
    res.send("DONE");
});

app.post("/disable_user", async (req, res) => {
    var { access_token, user_id } = req.body;
    var user_obj = await get_user1(user_id);
    var panel_obj = await get_panel(user_obj.corresponding_panel_id);
    var result = await disable_vpn(panel_obj.panel_url, panel_obj.panel_username, panel_obj.panel_password, user_obj.username);
    if (result == "ERR") res.send({ status: "ERR", msg: "failed to connect to marzban" });
    else {
        await update_user(user_id, { status: "disable", disable: 1 });
        var account = await token_to_account(access_token);
        await insert_to_logs(account.id, "DISABLE_USER", `disabled user !${user_obj.username}`);
        res.send("DONE");
    }
});

app.post("/enable_agent", async (req, res) => {
    var { access_token, agent_id } = req.body;
    await update_account(agent_id, { disable: 0 });
    var account = await token_to_account(access_token);
    var agent_obj = await get_account(agent_id);
    await insert_to_logs(account.id, "ENABLE_AGENT", `enabled agent !${agent_obj.username}`);
    res.send("DONE");
});

app.post("/enable_panel", async (req, res) => {
    var { access_token, panel_id } = req.body;
    await update_panel(panel_id, { disable: 0 });
    var account = await token_to_account(access_token);
    var panel_obj = await get_panel(panel_id);
    await insert_to_logs(account.id, "ENABLE_PANEL", `enabled panel !${panel_obj.panel_name}`);
    res.send("DONE");
});

app.post("/enable_user", async (req, res) => {
    var { access_token, user_id } = req.body;
    var user_obj = await get_user1(user_id);
    var panel_obj = await get_panel(user_obj.corresponding_panel_id);
    var result = await enable_vpn(panel_obj.panel_url, panel_obj.panel_username, panel_obj.panel_password, user_obj.username);
    if (result == "ERR") res.send({ status: "ERR", msg: "failed to connect to marzban" });
    else {
        await update_user(user_id, { status: "active", disable: 0 });
        var account = await token_to_account(access_token);
        await insert_to_logs(account.id, "ENABLE_USER", `enabled user !${user_obj.username}`);
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
        var agents_arr = await accounts_clct.find({ is_admin: 0 }).toArray();
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
        var log_msg = `edited agent ${name} `
        if(Math.floor(old_volume) != Math.floor(gb2b(volume))) 
        {
            log_msg += `and added !${b2gb(gb2b(volume) - old_volume)} GB data`
            insert_to_logs(agent_id,"RECEIVE_DATA",`received !${b2gb(gb2b(volume) - old_volume)} GB data`)
        }
        await insert_to_logs(account.id, "EDIT_AGENT", log_msg);
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


    if (!panel_name || !panel_username || !panel_password || !panel_user_max_count || !panel_traffic) res.send({ status: "ERR", msg: "fill all of the inputs" })
    else if (panel_info == "ERR") res.send({ status: "ERR", msg: "Failed to connect to panel" });

    else {
        await update_panel(panel_id, {
            panel_name,
            panel_username,
            panel_password,
            panel_user_max_count: parseInt(panel_user_max_count),
            panel_traffic: dnf(panel_traffic),
        });
        var account = await token_to_account(access_token);
        await insert_to_logs(account.id, "EDIT_PANEL", `edited panel !${panel_name}`);
        res.send("DONE");
    }

});

app.post("/edit_user", async (req, res) => {
    const { user_id,
        expire,
        data_limit,
        country,
        access_token } = req.body;

    if (!user_id || !expire || !data_limit || !country) res.send({ status: "ERR", msg: "fill all of the inputs" })

    var user_obj = await get_user1(user_id);
    var panel_obj = await get_panel(user_obj.corresponding_panel_id);
    var corresponding_agent = await token_to_account(access_token);
    var old_data_limit = b2gb(user_obj.data_limit);

    if (corresponding_agent.disable) res.send({ status: "ERR", msg: "your account is disabled" })
    else if (data_limit - old_data_limit > corresponding_agent.allocatable_data) res.send({ status: "ERR", msg: "not enough allocatable data" })
    else if (expire > corresponding_agent.max_days) res.send({ status: "ERR", msg: "maximum allowed days is " + corresponding_agent.max_days })
    else if (corresponding_agent.min_vol > data_limit) res.send({ status: "ERR", msg: "minimum allowed data is " + corresponding_agent.min_vol })
    else {
        var result = await edit_vpn(panel_obj.panel_url, panel_obj.panel_username, panel_obj.panel_password, user_obj.username, data_limit * ((2 ** 10) ** 3), Math.floor(Date.now() / 1000) + expire * 24 * 60 * 60);

        if (result == "ERR") res.send({ status: "ERR", msg: "failed to connect to marzban" });

        else {

            await update_user(user_id, {
                expire: Math.floor(Date.now() / 1000) + expire * 24 * 60 * 60,
                data_limit: data_limit * ((2 ** 10) ** 3),
            });

            if( !(corresponding_agent.business_mode == 1 && (user_obj.used_traffic > user_obj.data_limit/4 || (user_obj.expire - user_obj.created_at) < (Math.floor(Date.now()/1000) - user_obj.created_at)*4 )) ) await update_account(corresponding_agent.id, { allocatable_data: dnf(corresponding_agent.allocatable_data - data_limit + old_data_limit) });
            var account = await token_to_account(access_token);
            await insert_to_logs(account.id, "EDIT_USER", `edited user !${user_obj.username} with !${data_limit} GB data and !${expire} days of expire time`);
            res.send("DONE");
        }


    }


});

app.post("/edit_self", async (req, res) => {
    const { username, password, access_token } = req.body;
    var corresponding_account = await token_to_account(access_token);
    var account_id = corresponding_account.id;
    var username_arr = await get_accounts();
    var username_arr = username_arr.map(x => x.username);
    var old_username = corresponding_account.username;
    if(username_arr.includes(username) && old_username != username) res.send({ status: "ERR", msg: "username already exists" });
    else
    {
        await update_account(account_id, { username, password });
        var account = await token_to_account(access_token);
        await insert_to_logs(account.id, "EDIT_SELF", `was self edited`);
        res.send("DONE");
    } 
});

app.post("/reset_user", async (req, res) => {
    const { username, access_token } = req.body;
    var user_obj = await get_user2(username);
    var user_id = user_obj.id;
    var panel_obj = await get_panel(user_obj.corresponding_panel_id);
    var corresponding_agent = await token_to_account(access_token);
    var old_data_limit = b2gb(user_obj.data_limit);

    if (corresponding_agent.disable) res.send({ status: "ERR", msg: "your account is disabled" })
    else if (b2gb(user_obj.used_traffic) > corresponding_agent.allocatable_data) res.send({ status: "ERR", msg: "not enough allocatable data" })
    else {
        var result = await reset_marzban_user(panel_obj.panel_url, panel_obj.panel_username, panel_obj.panel_password, user_obj.username);

        if (result == "ERR") res.send({ status: "ERR", msg: "failed to connect to marzban" });
        else {  

            await update_user(user_id, { used_traffic: 0 });
            if( !(corresponding_agent.business_mode == 1 && (user_obj.used_traffic > user_obj.data_limit/4 || (user_obj.expire - user_obj.created_at) < (Math.floor(Date.now()/1000) - user_obj.created_at)*4 )) ) await update_account(corresponding_agent.id, { allocatable_data: dnf(corresponding_agent.allocatable_data + old_data_limit) });
            var account = await token_to_account(access_token);
            await insert_to_logs(account.id, "RESET_USER", `reseted user !${user_obj.username}`);
            res.send("DONE");
        }


    }

});


app.listen(5000, () => {
    console.log("--------------");
    console.log("SERVER STARTED !");
    console.log("--------------");
});



