const axios = require('axios');
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://127.0.0.1:27017');

var db,accounts_clct,panels_clct,users_clct,logs_clct;


// --- UTILS --- //

const uid = () => { return Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000; }

const uidv2 = () => 
{
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 30) 
    {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

const sleep = (ms) =>
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

const insert_to_accounts = async (obj) => { await accounts_clct.insertOne(obj);return "DONE"; }
const get_accounts = async () => {const result = await accounts_clct.find().toArray();return result;}
const get_account = async (id) => {const result = await accounts_clct.find({id}).toArray();return result[0];}
const update_account = async (id,value) => {await accounts_clct.updateOne({id},{$set:value},function(){});return "DONE";}

const insert_to_panels = async (obj) => { await panels_clct.insertOne(obj);return "DONE"; }
const get_panels = async () => {const result = await panels_clct.find().toArray();return result;}
const get_panel = async (id) => {const result = await panels_clct.find({id}).toArray();return result[0];}
const update_panel = async (id,value) => {await panels_clct.updateOne({id},{$set:value},function(){});return "DONE";}

const insert_to_users = async (obj) => { await users_clct.insertOne(obj);return "DONE"; }
const get_users = async (agent_id) => {const result = await users_clct.find({agent_id}).toArray();return result;}
const get_all_users = async () => {const result = await users_clct.find({}).toArray();return result;}
const get_user1 = async (id) => {const result = await users_clct.find({id}).toArray();return result[0];}
const get_user2 = async (username) => {const result = await users_clct.find({username}).toArray();return result[0];}
const update_user = async(id,value) => {await users_clct.updateOne({id},{$set:value},function(){});return "DONE";}

const insert_to_logs = async (account_id,action,msg) => 
{
    var username = (await get_account(account_id)).username;
    var obj = { 
                id:uid(),
                account_id,
                action,
                msg:username + " " + msg,
                time:Math.floor(Date.now()/1000)
              }

    await logs_clct.insertOne(obj);
    return "DONE"; 
}

const get_logs = async () => {const result = await logs_clct.find().toArray();return result;}


const b2gb = (bytes) => 
{
    var x = (bytes / (2 ** 10) ** 3);
    return Math.round(x*100)/100;
}

const gb2b = (g) => 
{
    return (g * (2 ** 10) ** 3);
}

const dnf = (x) => // Desired Number Format
{
    return Math.round(x*100)/100;
}

const add_token = async (id) => 
{
    var expire = Math.floor(Date.now()/1000) + 3600;
    var token = uidv2();
    var obj = { token , expire };
    await accounts_clct.updateOne({id},{$push:{tokens:obj}},function(){});return token;
}

const token_to_account = async (token) => 
{
    var accounts = await get_accounts();
    var account = accounts.filter(x => x.tokens.filter(y => y.token == token)[0])[0];
    return account;
}

// --- MARZBAN UTILS --- //

const auth_marzban = async (link,username,password) =>
{
    try
    {
        var auth_res = 
        {
            'accept': 'application/json',
            'Authorization':'',
            'Content-Type': 'application/json'
        };

        const headers =
        {
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        var resp = await axios.post(link+"/api/admin/token",{username,password},{headers},{timeout:10000});
        auth_res['Authorization'] = resp.data['token_type'] + ' ' + resp.data['access_token'];
        return auth_res;
    }

    catch(err)
    {
        return "ERR";
    }
}

const get_panel_info = async (link,username,password) =>
{
    try
    {
        var headers = await auth_marzban(link,username,password);
        if(headers == "ERR") return "ERR";
        var panel_info = (await axios.get(link+"/api/system",{headers,timeout:10000})).data;
        var panel_inbounds = (await axios.get(link+"/api/inbounds",{headers,timeout:10000})).data;
    
        var info_obj =
        {
            total_users:panel_info['total_user'],
            active_users:panel_info['users_active'],
            panel_data_usage:b2gb(panel_info['incoming_bandwidth'] + panel_info['outgoing_bandwidth']),
            panel_inbounds     
        };
    
        return info_obj;
    }

    catch(err)
    {
        return "ERR"
    }
}

const make_vpn = async (link,username,password,vpn_name,data_limit,expire) =>
{
    try
    {
        var headers = await auth_marzban(link,username,password);
        if(headers == "ERR") return "ERR";
        var {panel_inbounds} = await get_panel_info(link,username,password);
        var proxy_obj = {};

        for(inbound in panel_inbounds) proxy_obj[inbound] = {}; 

        var req_obj = 
        {
            "username":vpn_name,
            "proxies":proxy_obj,
            "inbounds":{},
            "expire":expire,
            "data_limit":data_limit,
            "data_limit_reset_strategy":"no_reset"
        };

        var res = await axios.post(link+"/api/user",req_obj,{headers});
        return res.data;
    }

    catch(err)
    {
        return "ERR";
    }
}

const delete_vpn = async (link,username,password,vpn_name) =>
{
    try
    {
        var headers = await auth_marzban(link,username,password);
        if(headers == "ERR") return "ERR";
        var res = await axios.delete(link+"/api/user/"+vpn_name,{headers});
        return "DONE";
    }

    catch(err)
    {
        return "ERR";
    }
}

const disable_vpn = async(link,username,password,vpn_name) =>
{
    try
    {
        var headers = await auth_marzban(link,username,password);
        if(headers == "ERR") return "ERR";
        var res = await axios.put(link+"/api/user/"+vpn_name,{status:"disabled"},{headers});
        return "DONE";
    }

    catch(err)
    {
        return "ERR";
    }
}

const enable_vpn = async(link,username,password,vpn_name) =>
{
    try
    {
        var headers = await auth_marzban(link,username,password);
        if(headers == "ERR") return "ERR";
        var res = await axios.put(link+"/api/user/"+vpn_name,{status:"active"},{headers});
        return "DONE";
    }

    catch(err)
    {
        return "ERR";
    }
}

const edit_vpn = async(link,username,password,vpn_name,data_limit,expire) =>
{
    try
    {
        var headers = await auth_marzban(link,username,password);
        if(headers == "ERR") return "ERR";
        var res = await axios.put(link+"/api/user/"+vpn_name,{data_limit,expire},{headers});
        return "DONE";
    }

    catch(err)
    {
        return "ERR";
    }
}

const get_marzban_user = async(link,username,password,vpn_name) =>
{
    try
    {
        var headers = await auth_marzban(link,username,password);
        if(headers == "ERR") return "ERR";
        var res = await axios.get(link+"/api/user/"+vpn_name,{headers});
        return res.data;
    }

    catch(err)
    {
        return "ERR";
    }
}

const get_all_marzban_users = async(link,username,password) =>
{
    try
    {
        var headers = await auth_marzban(link,username,password);
        if(headers == "ERR") return "ERR";
        var res = await axios.get(link+"/api/users",{headers,timeout:20000});
        return res.data;
    }

    catch(err)
    {
        return "ERR";
    }
}

const reload_agents = async() =>
{
    var obj_arr = await accounts_clct.find({is_admin:0}).toArray();

    for(obj of obj_arr)
    {
        var agent_id = obj.id;
        var agent_users = await get_users(agent_id);
        var active_users = agent_users.filter(x => x.status == "active").length;
        var total_users = agent_users.length;
        var used_traffic = b2gb(agent_users.reduce((acc,curr) => acc + curr.used_traffic,0));
        await update_account(agent_id,{active_users,total_users,used_traffic});
    }
}

const reset_marzban_user = async(link,username,password,vpn_name) =>
{
    try
    {
        console.log(link,username,password,vpn_name);
        var headers = await auth_marzban(link,username,password);
        if(headers == "ERR") return "ERR";
        var res = await axios.post(link+"/api/user/"+vpn_name+"/reset","",{headers});
        return "DONE";
    }

    catch(err)
    {
        return "ERR";
    }
}

const ping_panel = async(panel_obj) =>
{
    try
    {
        var {link,username,password} = panel_obj;

        for(var i=0;i<3;i++)
        {
            var headers = await auth_marzban(link,username,password);
            if(headers == "ERR")
            {
                console.log("cannot connect to panel " + panel_obj.panel_url + " ===> retrying (" + (i+1) + "/3)");
                await sleep(5000);
            }

            else
            {
                return "OK";
            }
        }

        console.log("cannot connect to panel " + panel_obj.panel_url + " ===> disabling");
        await update_panel(panel_obj.id,{disable:1});

    }

    catch(err)
    {
        return "ERR";
    }
}

async function connect_to_db()
{
    await client.connect();
    db = client.db('KN_PANEL');
    return{
        accounts_clct : db.collection('accounts'),
        panels_clct : db.collection('panels'),
        users_clct : db.collection('users'),
        logs_clct : db.collection('logs')
          }

};

connect_to_db().then(res =>
{
    accounts_clct = res.accounts_clct;
    panels_clct = res.panels_clct;
    users_clct = res.users_clct;
    logs_clct = res. logs_clct;
});


module.exports = {  uid,
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
                    connect_to_db
                 }