const axios = require('axios');
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://127.0.0.1:27017');
const fs = require('fs');

var db, accounts_clct, panels_clct, users_clct, logs_clct;

var MAIN_PANEL_URL = "http://localhost:5000"

// --- UTILS --- //

const uid = () => { return Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000; }

const uidv2 = (x) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < x) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const get_main_panel_url = () => { return MAIN_PANEL_URL; }

const insert_to_accounts = async (obj) => { await accounts_clct.insertOne(obj); return "DONE"; }
const get_accounts = async () => { const result = await accounts_clct.find().toArray(); return result; }
const get_account = async (id) => { const result = await accounts_clct.find({ id }).toArray(); return result[0]; }
const update_account = async (id, value) => { await accounts_clct.updateOne({ id }, { $set: value }, function () { }); return "DONE"; }

const insert_to_panels = async (obj) => { await panels_clct.insertOne(obj); return "DONE"; }
const get_panels = async () => { const result = await panels_clct.find().toArray(); return result; }
const get_panel = async (id) => { const result = await panels_clct.find({ id }).toArray(); return result[0]; }
const update_panel = async (id, value) => { await panels_clct.updateOne({ id }, { $set: value }, function () { }); return "DONE"; }

const insert_to_users = async (obj) => { await users_clct.insertOne(obj); return "DONE"; }
const get_users = async (agent_id) => { const result = await users_clct.find({ agent_id }).toArray(); return result; }
const get_all_users = async () => { const result = await users_clct.find({}).toArray(); return result; }
const get_user1 = async (id) => { const result = await users_clct.find({ id }).toArray(); return result[0]; }
const username_to_id = async (username) => { const result = await accounts_clct.find({ username },{id:1}).toArray();return result[0] && result[0].id }
const get_user2 = async (username) => { const result = await users_clct.find({ username }).toArray(); return result[0]; }
const update_user = async (id, value) => { await users_clct.updateOne({ id }, { $set: value }, function () { }); return "DONE"; }

const insert_to_logs = async (account_id, action, msg) => {
    var username = (await get_account(account_id)).username;
    var obj = {
        id: uid(),
        account_id,
        action,
        msg: username + " " + msg,
        time: Math.floor(Date.now() / 1000)
    }

    await logs_clct.insertOne(obj);
    return "DONE";
}

const get_logs = async () => { const result = await logs_clct.find().toArray(); return result; }


const b2gb = (bytes) => {
    var x = (bytes / (2 ** 10) ** 3);
    return Math.round(x * 100) / 100;
}

const gb2b = (g) => {
    return (g * (2 ** 10) ** 3);
}

const dnf = (x) => // Desired Number Format
{
    return Math.round(x * 100) / 100;
}

const add_token = async (id) => {
    var expire = Math.floor(Date.now() / 1000) + 86400;
    var token = uidv2(30);
    var obj = { token, expire };
    await accounts_clct.updateOne({ id }, { $push: { tokens: obj } }, function () { }); return token;
}

const token_to_account = async (token) => {
    var accounts = await get_accounts();
    var account = accounts.filter(x => x.tokens.filter(y => y.token == token)[0])[0];
    return account;
}

// --- MARZBAN UTILS --- //

const auth_marzban = async (link, username, password) => {
    try {
        var auth_res =
        {
            'accept': 'application/json',
            'Authorization': '',
            'Content-Type': 'application/json'
        };

        const headers =
        {
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        var resp = await axios.post(link + "/api/admin/token", { username, password }, { headers }, { timeout: 10000 });
        auth_res['Authorization'] = resp.data['token_type'] + ' ' + resp.data['access_token'];
        return auth_res;
    }

    catch (err) {
        return "ERR";
    }
}

const get_panel_info = async (link, username, password) => {
    try {
        var headers = await auth_marzban(link, username, password);
        if (headers == "ERR") return "ERR";
        var panel_info = (await axios.get(link + "/api/system", { headers, timeout: 10000 })).data;
        var panel_inbounds = (await axios.get(link + "/api/inbounds", { headers, timeout: 10000 })).data;

        var info_obj =
        {
            total_users: panel_info['total_user'],
            active_users: panel_info['users_active'],
            panel_data_usage: b2gb(panel_info['incoming_bandwidth'] + panel_info['outgoing_bandwidth']),
            panel_inbounds
        };

        return info_obj;
    }

    catch (err) {
        return "ERR"
    }
}

const make_vpn = async (link, username, password, vpn_name, data_limit, expire, protocols, flow_status) => {
    try {
        var headers = await auth_marzban(link, username, password);
        if (headers == "ERR") return "ERR";
        var { panel_inbounds } = await get_panel_info(link, username, password);
        var proxy_obj = {};

        for (inbound in panel_inbounds) 
        {
            if(protocols.includes(inbound)) 
            {
                proxy_obj[inbound] = {};
                if(inbound == "vless" && flow_status != "none") proxy_obj[inbound]['flow'] = flow_status;
            }
        }

        var req_obj =
        {
            "username": vpn_name,
            "proxies": proxy_obj,
            "inbounds": {},
            "expire": expire,
            "data_limit": data_limit,
            "data_limit_reset_strategy": "no_reset"
        };

        var res = await axios.post(link + "/api/user", req_obj, { headers });
        return res.data;
    }

    catch (err) {
        return "ERR";
    }
}

const delete_vpn = async (link, username, password, vpn_name) => {
    try {
        var headers = await auth_marzban(link, username, password);
        if (headers == "ERR") return "ERR";
        var res = await axios.delete(link + "/api/user/" + vpn_name, { headers });
        return "DONE";
    }

    catch (err) {
        return "ERR";
    }
}

const disable_vpn = async (link, username, password, vpn_name) => {
    try {
        var headers = await auth_marzban(link, username, password);
        if (headers == "ERR") return "ERR";
        var res = await axios.put(link + "/api/user/" + vpn_name, { status: "disabled" }, { headers });
        return "DONE";
    }

    catch (err) {
        return "ERR";
    }
}

const enable_vpn = async (link, username, password, vpn_name) => {
    try {
        var headers = await auth_marzban(link, username, password);
        if (headers == "ERR") return "ERR";
        var res = await axios.put(link + "/api/user/" + vpn_name, { status: "active" }, { headers });
        return "DONE";
    }

    catch (err) {
        return "ERR";
    }
}

const edit_vpn = async (link, username, password, vpn_name, data_limit, expire) => {
    try {
        var headers = await auth_marzban(link, username, password);
        if (headers == "ERR") return "ERR";
        var res = await axios.put(link + "/api/user/" + vpn_name, { data_limit, expire }, { headers });
        return "DONE";
    }

    catch (err) {
        return "ERR";
    }
}

const get_marzban_user = async (link, username, password, vpn_name) => {
    try {
        var headers = await auth_marzban(link, username, password);
        if (headers == "ERR") return "ERR";
        var res = await axios.get(link + "/api/user/" + vpn_name, { headers });
        return res.data;
    }

    catch (err) {
        return "ERR";
    }
}

const get_all_marzban_users = async (link, username, password) => {
    try {
        var headers = await auth_marzban(link, username, password);
        if (headers == "ERR") return "ERR";
        var res = await axios
        ({
            url:secondary_backend_url_converter(link,"get_marzban_users"),
            method: 'POST',
            data: {api_key:"resllmwriewfeujeh3i3ifdkmwheweljedifefhyr"},
            timeout: 15000
        });

        // var res = await axios.get(link + "/api/users", { headers, timeout: 15000 });
        return res.data;
    }

    catch (err) {
        return "ERR";
    }
}

const reload_agents = async () => {
    var obj_arr = await accounts_clct.find({ is_admin: 0 }).toArray();

    for (obj of obj_arr) {
        var agent_id = obj.id;
        var agent_users = await get_users(agent_id);
        var active_users = agent_users.filter(x => x.status == "active").length;
        var total_users = agent_users.length;
        var used_traffic = b2gb(agent_users.reduce((acc, curr) => acc + curr.used_traffic, 0));
        await update_account(agent_id, { active_users, total_users, used_traffic });
    }
}

const reset_marzban_user = async (link, username, password, vpn_name) => {
    try {
        var headers = await auth_marzban(link, username, password);
        if (headers == "ERR") return "ERR";
        var res = await axios.post(link + "/api/user/" + vpn_name + "/reset", "", { headers });
        return "DONE";
    }

    catch (err) {
        return "ERR";
    }
}

const ping_panel = async (panel_obj) => {
    try {
        var { link, username, password } = panel_obj;

        for (var i = 0; i < 3; i++) {
            var headers = await auth_marzban(link, username, password);
            if (headers == "ERR") {
                await syslog("cannot connect to panel " + panel_obj.panel_url + " ---> retrying (" + (i + 1) + "/3)");
                await sleep(5000);
            }

            else {
                return "OK";
            }
        }

        await syslog("cannot connect to panel " + panel_obj.panel_url + " ---> disabling");
        await disable_panel(panel_obj.id);

    }

    catch (err) {
        return "ERR";
    }
}

const dl_file = async (url,destination) =>
{
    try
    {
        const response = await axios
        ({
          url,
          method: 'POST',
          responseType: 'stream',
          data: {api_key: "resllmwriewfeujeh3i3ifdkmwheweljedifefhyr"},
          timeout:15000
        });
      
            
        const writer = fs.createWriteStream(destination);
      
        response.data.pipe(writer);
      
        return new Promise((resolve, reject) => 
        {
          writer.on('finish', resolve);
          writer.on('error', reject);
          response.data.on('error', reject);
        });
    }

    catch(err)
    {
        throw new Error(`DL ERROR : ${err.message}`);
    }

}

const show_url = (str) => {
    str = str.replace(/^https?:\/\//, '');
    str = str.replace(/:\d+$/, '');
    return str;
}

const delete_folder_content = async (dir_path) => 
{
    try
    {
        await fs.promises.rm(dir_path, { recursive: true, force: true });
    }
    
    catch(err)
    {

    }
}

const disable_panel = async (panel_id) =>
{
    await update_panel(panel_id, { disable:1,last_online:Math.floor(Date.now()/1000) });
    await users_clct.updateMany({corresponding_panel_id:panel_id},{$set:{status:"anonym",disable:0}})
}

const enable_panel = async (panel_id) =>
{
    var panel_obj = await get_panel(panel_id);
    if(Math.floor(Date.now()/1000) - panel_obj.last_online > 600)
    {
        try
        {
            const response = await axios
            ({
                url: secondary_backend_url_converter(panel_obj.panel_url,"edit_expire_times"),
                method: 'POST',
                responseType: 'stream',
                data: {api_key:"resllmwriewfeujeh3i3ifdkmwheweljedifefhyr",added_time:Math.floor(Date.now()/1000) - panel_obj.last_online}
            });

            await syslog("added " + Math.floor(Date.now()/1000) - panel_obj.last_online + " seconds to expire times of panel " + panel_obj.panel_url)
        }

        catch(err)
        {
            console.log(err);
            await syslog("ERROR : failed to update expire times of panel " + panel_obj.panel_url);
        }

    }

    
    await update_panel(panel_id, { disable:0,last_online:2000000000 });
}


const secondary_backend_url_converter = (url,method) =>
{
    return url.split(":")[0].replace("https","http") + ":" + url.split(":")[1] + ":7002/" + method;
}

const syslog = async (str) =>
{
    try 
    {
        var date = new Date();
        str = date.toLocaleString("en-US",{ hourCycle: 'h23' }).replace(", "," - ") + " ===> " + str;
        console.log(str);
        await fs.promises.appendFile("frontend/public/syslog/syslog.txt",str + "\n");
        return "DONE";
    }

    catch(err)
    {
        return "ERR";
    }
}

async function connect_to_db() {
    await client.connect();
    db = client.db('KN_PANEL');
    return {
        accounts_clct: db.collection('accounts'),
        panels_clct: db.collection('panels'),
        users_clct: db.collection('users'),
        logs_clct: db.collection('logs')
    }

};

connect_to_db().then(res => {
    accounts_clct = res.accounts_clct;
    panels_clct = res.panels_clct;
    users_clct = res.users_clct;
    logs_clct = res.logs_clct; 
});


module.exports = {
    uid,
    uidv2,
    sleep,
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
    auth_marzban,
    get_panel_info,
    make_vpn,
    delete_vpn,
    disable_vpn,
    enable_vpn,
    edit_vpn,
    get_marzban_user,
    get_all_marzban_users,
    reload_agents,
    reset_marzban_user,
    ping_panel,
    connect_to_db,
    dl_file,
    show_url,
    delete_folder_content,
    disable_panel,
    enable_panel,
    secondary_backend_url_converter,
    syslog,
    get_main_panel_url
}
