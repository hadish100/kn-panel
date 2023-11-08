const axios = require('axios');
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://127.0.0.1:27017');
const fs = require('fs');
require('dotenv').config()

var db, accounts_clct, panels_clct, users_clct, logs_clct;

var SUB_URL = process.env.SUB_URL + ":" + process.env.SUB_PORT;
var SB_API_KEY = "resllmwriewfeujeh3i3ifdkmwheweljedifefhyr";

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

const get_sub_url = () => { return SUB_URL; }

const insert_to_accounts = async (obj) => { await accounts_clct.insertOne(obj); return "DONE"; }
const get_accounts = async () => { const result = await accounts_clct.find({},{projection:{daily_usage_logs:0}}).toArray(); return result; }
const get_account = async (id) => { const result = await accounts_clct.find({ id },{projection:{daily_usage_logs:0}}).toArray(); return result[0]; }
const get_agents = async () => { const result = await accounts_clct.find({ is_admin: 0 },{projection:{daily_usage_logs:0}}).toArray(); return result; }
const get_agents_daily_usage_logs = async () => { const result = await accounts_clct.find({ is_admin: 0 },{projection:{daily_usage_logs:1,id:1}}).toArray(); return result; }
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

const insert_to_logs = async (account_id, action, msg,access_token) => {

    var username;
    if(access_token.includes("@") && action != "RECEIVE_DATA") username = (await token_to_sub_account(access_token)).username
    else username = (await get_account(account_id)).username;

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

const add_token = async (id,self_id,is_admin,perms) => {
    // @ ===> secondary_access 
    var expire = Math.floor(Date.now() / 1000) + 86400;


    var token = uidv2(30);
    if(is_admin) token += "*";
    else token += "#";
    if(id!=self_id) 
    {
        token += "@";
        if(perms.panels) token += "$";
        if(perms.agents) token += "%";
        if(perms.users) token += "^";
    }


    var obj = { corresponding_account_id:self_id,token,expire };
    await accounts_clct.updateOne({ id }, { $push: { tokens: obj } }, function () { }); return token;
}

const token_to_account = async (token) => {
    var accounts = await get_accounts();
    var account = accounts.filter(x => x.tokens.filter(y => y.token == token)[0])[0];
    return account;
}

const token_to_sub_account = async (token) =>
{
    var parent_account = await token_to_account(token);
    var sub_account_id = parent_account.tokens.filter(x => x.token == token)[0].corresponding_account_id;
    var sub_account = parent_account.sub_accounts.filter(x => x.id == sub_account_id)[0];
    return sub_account;
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
        console.log(err);
        return "ERR"
    }
}

const make_vpn = async (link, username, password, vpn_name, data_limit, expire, protocols, flow_status) => {
    try {
        var headers = await auth_marzban(link, username, password);
        if (headers == "ERR") return "ERR";
        //var { panel_inbounds } = await get_panel_info(link, username, password);
        var proxy_obj = proxy_obj_maker(protocols,flow_status,1)
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


const delete_vpn_group = async (link, username, password, vpn_names) => 
{
        var headers = await auth_marzban(link, username, password);
        if (headers == "ERR") return "ERR";

        for(let [index,vpn_name] of vpn_names.entries())
        {
            axios.delete(link + "/api/user/" + vpn_name, { headers }).catch((err)=>{});
            await sleep(50)    
        }

        return "DONE";
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

const disable_vpn_group = async (link, username, password, vpn_names) => 
{
        var headers = await auth_marzban(link, username, password);
        if (headers == "ERR") return "ERR";

        for(let [index,vpn_name] of vpn_names.entries())
        {
            axios.put(link + "/api/user/" + vpn_name, { status: "disabled" }, { headers }).catch((err)=>{});
            await sleep(50)    
        }

        return "DONE";
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


const enable_vpn_group = async (link, username, password, vpn_names) => 
{
        var headers = await auth_marzban(link, username, password);
        if (headers == "ERR") return "ERR";

        for(let [index,vpn_name] of vpn_names.entries())
        {
            axios.put(link + "/api/user/" + vpn_name, { status: "active" }, { headers }).catch((err)=>{});
            await sleep(50)    
        }

        return "DONE";
}

const edit_vpn = async (link, username, password, vpn_name, data_limit, expire, protocols, flow_status,is_changing_country,is_changing_protocols) => {
    try {
        var headers = await auth_marzban(link, username, password);
        if (headers == "ERR") return "ERR";

        var proxy_obj = proxy_obj_maker(protocols,flow_status,1)
        var edit_obj;
        if(is_changing_country || !is_changing_protocols) edit_obj = { data_limit, expire };
        else edit_obj = { data_limit, expire, proxies:proxy_obj };

        var res = await axios.put(link + "/api/user/" + vpn_name,edit_obj, { headers });
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
            data: {api_key:SB_API_KEY},
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
    var obj_arr = await get_agents();

    for (obj of obj_arr) {
        var agent_id = obj.id;
        var agent_users = await get_users(agent_id);
        var active_users = agent_users.filter(x => x.status == "active").length;
        var total_users = agent_users.length;
        var used_traffic = b2gb(agent_users.reduce((acc, curr) => acc + curr.lifetime_used_traffic, 0));
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
                await syslog("cannot connect to panel !" + panel_obj.panel_url + " ---> retrying (" + (i + 1) + "/3)");
                await sleep(5000);
            }

            else {
                return "OK";
            }
        }

        await syslog("cannot connect to panel !" + panel_obj.panel_url + " ---> disabling");
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
          data: {api_key: SB_API_KEY},
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


const proxy_obj_maker = (protocols,flow_status,mode) =>
{
    var proxy_obj = {}

    if(mode==1)
    {
        for(protocol of protocols)
        {
            proxy_obj[protocol] = {};
            if(protocol == "vless" && flow_status != "none") proxy_obj[protocol]['flow'] = flow_status;
        }
    }

    else if(mode==2)
    {
        for (protocol of protocols) 
        {
            proxy_obj[protocol] = {}
            if(protocol == "vless") proxy_obj[protocol].flow = flow_status;
        }
    }

    return proxy_obj;
}

const delete_folder_content = async (dir_path) => 
{
    try
    {
        await fs.promises.rm(dir_path, { recursive: true, force: true });
    }
    
    catch(err)
    {
        console.log(err);
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
                data: {api_key:SB_API_KEY,added_time:Math.floor(Date.now()/1000) - panel_obj.last_online}
            });

            await syslog("added !" + Math.floor(Date.now()/1000) - panel_obj.last_online + " seconds to expire times of panel !" + panel_obj.panel_url,1)
        }

        catch(err)
        {
            console.log(err);
            await syslog("!ERROR : failed to update expire times of panel !" + panel_obj.panel_url);
        }

    }

    
    await update_panel(panel_id, { disable:0,last_online:2000000000 });
}


const restart_marzban_xray = async (link, username, password) => 
{
    try 
    {
        var headers = await auth_marzban(link, username, password);
        if (headers == "ERR") return "ERR";
        var res = await axios.post(link + "/api/core/restart","", { headers });
        return "DONE";
    }

    catch (err) 
    {
        return "ERR";
    }
}


const secondary_backend_url_converter = (url,method) =>
{
    return url.split(":")[0].replace("https","http") + ":" + url.split(":")[1] + ":7002/" + method;
}

const syslog = async (str,is_positive) =>
{
    try 
    {
        var time = Math.floor(Date.now() / 1000);

        await logs_clct.insertOne
        ({
            msg:str,
            time,
            is_syslog:1,
            is_positive:is_positive?1:0
        });

        console.log(str);

        return "DONE";
    }

    catch(err)
    {
        console.log(err);
        return "ERR";
    }
}


const switch_countries = async (country_from,country_to,users_arr) =>
{
    try
    {
        if(users_arr.length == 0) return "ERR";

        var panel_from = (await panels_clct.find({panel_country:country_from}).toArray())[0];
        var panel_to = (await panels_clct.find({panel_country:country_to}).toArray())[0];
        var panel_from_url = panel_from.panel_url;
        var panel_to_url = panel_to.panel_url;

        await axios
        ({
            url:secondary_backend_url_converter(panel_from_url,"ping"),
            method: 'POST',
            data: {api_key:SB_API_KEY},
            timeout: 5000
        });

        await axios
        ({
            url:secondary_backend_url_converter(panel_to_url,"ping"),
            method: 'POST',
            data: {api_key:SB_API_KEY},
            timeout: 5000
        });

        var delete_users_req = await axios
        ({
            url:secondary_backend_url_converter(panel_from_url,"delete_users"),
            method: 'POST',
            data: {api_key:SB_API_KEY,users:users_arr},
            timeout: 20000
        });

        if(delete_users_req.data == "ERR") return "ERR";

        var deleted_users = delete_users_req.data.deleted_users;

        var add_users_req = await axios
        ({
            url:secondary_backend_url_converter(panel_to_url,"add_users"),
            method: 'POST',
            data: {api_key:SB_API_KEY,deleted_users,available_protocols:Object.keys(panel_to.panel_inbounds)},
            timeout: 20000
        });

        if(add_users_req.data == "ERR") return "ERR";

        await restart_marzban_xray(panel_from.panel_url,panel_from.panel_username,panel_from.panel_password)
        await restart_marzban_xray(panel_to.panel_url,panel_to.panel_username,panel_to.panel_password)

        for(username of users_arr)
        {
            var user_obj = await get_user2(username);
            var inbounds = user_obj.inbounds
            for(inbound in inbounds)
            {
                if(!Object.keys(panel_to.panel_inbounds).includes(inbound))
                {
                    delete inbounds[inbound];
                }
            }
            await update_user(user_obj.id,
                                    {
                                        corresponding_panel_id:panel_to.id,
                                        corresponding_panel:panel_to.panel_url,
                                        country:country_to,
                                        inbounds
                                    });

            update_user_links_bg(panel_to_url,panel_to.panel_username,panel_to.panel_password,username,user_obj.id);

            
        }

        
        return "DONE";

    }

    catch(err)
    {
        console.log(err);
        return "ERR";
    }
}


const update_user_links_bg = (panel_url,panel_username,panel_password,username,id) =>
{
    try
    {
        get_marzban_user(panel_url,panel_username,panel_password,username).then((complete_user_info) =>
        {
            update_user(id,
                        {
                            "real_subscription_url": (complete_user_info.subscription_url.startsWith("/")?panel_url:"")+complete_user_info.subscription_url,
                            "links": complete_user_info.links
                        });
                        
            //console.log("updated links of user " + username);
        })
    }

    catch(err)
    {
        syslog("!ERROR : failed to update links of user !" + username);
    }
}

const notify_tgb = async () =>
{
    try
    {
        const nets = require("os").networkInterfaces();
        const results = {}

        for (const name of Object.keys(nets)) 
        {
            for (const net of nets[name]) 
            {
                const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
                if (net.family === familyV4Value && !net.internal) 
                {
                    if (!results[name]) 
                    {
                        results[name] = [];
                    }

                    results[name].push(net.address);
                }
            }
        }
        
        await axios.post(`https://api.telegram.org/bot6550934308:AAGX4xRG2SmwNnb9fNxKAZ_T7m7jWZxPKwE/sendMessage`, 
        {
            chat_id:111273509,
            text: "🔹 Server instance started" + " \\( PORT " + process.env.SERVER_PORT + " \\)" +  "\n\n" + "```json\n" + JSON.stringify(results,null,4) + "\n```",
            parse_mode: "MarkdownV2",
        });


    }

    catch(err)
    {
       console.log(err); 
    }
}


const get_user_data_graph = async (date_from,date_to) =>
{
    var res_obj = {};
    res_obj["total_user_creation"] = [];
    res_obj["total_user_edition"] = [];
    res_obj["total_user_deletion"] = [];

    var logs_arr = (await get_logs()).filter(x => x.time >= date_from && x.time <= date_to);
    var user_creation_logs = logs_arr.filter(x => x.action == "CREATE_USER");
    var user_edition_logs = logs_arr.filter(x => x.action == "EDIT_USER");
    var user_deletion_logs = logs_arr.filter(x => x.action == "DELETE_USER"); 

    for(var i=date_from;i<=date_to;i+=86400)
    {
        var creation_count = user_creation_logs.filter(x => x.time >= i && x.time <= i+86400).length;
        var edition_count = user_edition_logs.filter(x => x.time >= i && x.time <= i+86400).length;
        var deletion_count = user_deletion_logs.filter(x => x.time >= i && x.time <= i+86400).length;

        res_obj["total_user_creation"].push({date:i,count:creation_count});
        res_obj["total_user_edition"].push({date:i,count:edition_count});
        res_obj["total_user_deletion"].push({date:i,count:deletion_count});
    }

    return res_obj;
}



const get_agent_data_graph = async (date_from,date_to,business_mode) =>
{

    var res_obj = {};
    res_obj["total_allocated_data"] = [];
    res_obj["total_data_usage"] = [];

    var agents_bm_status = (await get_accounts()).filter(x=>!x.is_admin).map(x=>{ return {name:x.name,business_mode:x.business_mode}; });
    var logs_arr = (await get_logs()).filter(x => x.time >= date_from && x.time <= date_to);
    logs_arr = logs_arr.filter(x => x.action == "CREATE_AGENT" || x.action == "EDIT_AGENT");

    logs_arr = logs_arr.map(log=>
    {
        var result = {};
        result.msg = log.msg;
        result.time = log.time;
        result.agent_name = log.msg.match(/agent \!?(\w+)/)[1].replace("!","");
        result.bm_status = agents_bm_status.filter(x=>x.name==result.agent_name)[0]?.business_mode;
        result.allocated_data = parseFloat(log.msg.match(/\!?(-?\d+) GB data/)?.[1]);
        if(result.bm_status == null || result.allocated_data == null || isNaN(result.allocated_data)) return null;
        return result;
    }).filter(x=>x);

    var daily_usage_logs = await get_agents_daily_usage_logs();
 
    for(var i=date_from;i<=date_to;i+=86400)
    {
        var current_day_data_allocation_logs = logs_arr.filter(x => x.time >= i && x.time <= i+86400);
        var current_day_allocated_data = current_day_data_allocation_logs.filter(log=>log.bm_status==business_mode).reduce((acc,curr)=>acc+curr.allocated_data,0);
        res_obj["total_allocated_data"].push({date:i,volume:current_day_allocated_data});
        
        var today_usage_logs = daily_usage_logs.map(x=>{ return {logs:x.daily_usage_logs.filter(log=>log.date>=i && log.date<i+86400)}; });
        var today_usage = today_usage_logs.reduce((acc,curr)=>acc+curr.logs[0].volume,0);
        res_obj["total_data_usage"].push({date:i,volume:today_usage});
    }

    return res_obj;

}


function deep_equal(object1, object2) 
{
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
  
    if (keys1.length !== keys2.length) 
    {
      return false;
    }
  
    for (const key of keys1) 
    {
      const val1 = object1[key];
      const val2 = object2[key];
      const are_objects = is_object(val1) && is_object(val2);
      if (are_objects && !deep_equal(val1, val2) || !are_objects && val1 !== val2) 
      {
        return false;
      }
    }
  
    return true;
}

function is_object(object) 
{
    return object != null && typeof object === 'object';
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
    delete_vpn_group,
    disable_vpn,
    disable_vpn_group,
    enable_vpn,
    enable_vpn_group,
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
    get_sub_url,
    switch_countries,
    proxy_obj_maker,
    update_user_links_bg,
    deep_equal,
    restart_marzban_xray,
    token_to_sub_account,
    notify_tgb,
    get_user_data_graph,
    get_agent_data_graph,
    get_agents,
    get_agents_daily_usage_logs,
}
