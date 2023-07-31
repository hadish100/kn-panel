const express = require('express');const app = express();
const axios = require('axios');
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

app.use(express.json());
app.use(auth_middleware);


var db,accounts_clct,panels_clct,logs_clct,users_clct;

(async function connect_to_db()
{
    await client.connect();
    db = client.db('KN_PANEL');
    accounts_clct = db.collection('accounts');
    panels_clct = db.collection('panels');
    users_clct = db.collection('users');
    logs_clct = db.collection('logs');
})();

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

const insert_to_accounts = async (obj) => { await accounts_clct.insertOne(obj);return "DONE"; }
const get_accounts = async () => {const result = await accounts_clct.find().toArray();return result;}
const get_account = async (id) => {const result = await accounts_clct.find({id}).toArray();return result[0];}
const update_account = async (id,value) => {await accounts_clct.updateOne({id},{$set:value},function(){});return "DONE";}

const insert_to_panels = async (obj) => { await panels_clct.insertOne(obj);return "DONE"; }
const get_panels = async () => {const result = await panels_clct.find().toArray();return result;}
const get_panel = async (id) => {const result = await panels_clct.find({id}).toArray();return result[0];}
const update_panel = async (id,value) => {await panels_clct.updateOne({id},{$set:value},function(){});return "DONE";}

const insert_to_logs = async (obj) => { await logs_clct.insertOne(obj);return "DONE"; }
const get_logs = async () => {const result = await logs_clct.find().toArray();return result;}
const get_log = async (id) => {const result = await logs_clct.find({id}).toArray();return result[0];}
const update_log = async (id,value) => {await logs_clct.updateOne({id},{$set:value},function(){});return "DONE";}

const insert_to_users = async (obj) => { await users_clct.insertOne(obj);return "DONE"; }
const get_users = async () => {const result = await users_clct.find().toArray();return result;}
const get_user = async (id) => {const result = await users_clct.find({id}).toArray();return result[0];}
const update_user = async(id,value) => {await users_clct.updateOne({id},{$set:value},function(){});return "DONE";}


const b2gb = (bytes) => 
{
    return (bytes / (2 ** 10) ** 3).toFixed(2);
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

async function get_agent_logs(access_token) 
{
    var obj = (await axios.get(API_SERVER_URL + '/api/logs/all/', { headers: { accept: 'application/json', Authorization: access_token } })).data
    return obj;
}

async function get_admin_logs(access_token) 
{
    var obj = (await axios.get(API_SERVER_URL + '/admin/logs/', { headers: { accept: 'application/json', Authorization: access_token }})).data
    return obj;
}


// --- MIDDLEWARE --- //

async function auth_middleware(req, res, next)
{

    var accounts = await get_accounts();
    accounts.forEach(async (account) => 
    {
        var tokens = account.tokens;
        var new_tokens = tokens.filter(x => x.expire > Math.floor(Date.now()/1000));
        await update_account(account.id,{tokens:new_tokens});
    });

    if(req.url == "/login") return next();
    var {access_token} = req.body;
    var account = await token_to_account(access_token);
    if(!account) return res.status(401).send({message: 'Token is either expired or invalid'});
    else return next();
}

async function log_middleware(req, res, next)
{
    console.log("HI");
}

// --- ENDPOINTS --- //

app.post("/get_agents", async (req, res) => 
{
    var obj_arr = await accounts_clct.find({is_admin:0}).toArray();
    res.send(obj_arr);
});

app.post("/get_panels", async (req, res) => 
{
    var obj_arr = await panels_clct.find({}).toArray();
    res.send(obj_arr);
});

app.post("/get_users", async (req, res) => 
{
    var { access_token } = req.body;
    var obj = await get_users();
    res.send(obj);
});

app.post("/get_agent", async (req, res) => 
{
    var { access_token } = req.body;
    var agent = await token_to_account(access_token);
    res.send(agent);
});

app.post("/get_agent_logs", async (req, res) => 
{
    var { access_token } = req.body;
    var obj = await get_agent_logs(access_token);
    res.send(obj);
});

app.post("/get_admin_logs", async (req, res) => 
{
    var { access_token } = req.body;
    var obj = await get_admin_logs(access_token);
    console.log(access_token);
    console.log(obj);
    res.send(obj);
});

app.post("/login", async (req, res) => 
{

    const {username,password} = req.body;
    const accounts = await get_accounts();
    const account = accounts.filter(x => x.username == username && x.password == password)[0];

    if(account)
    {
        var access_token = await add_token(account.id);
        res.send({is_admin:account.is_admin,access_token});
    }

    else
    {
        res.status(401).send({message: 'NOT FOUND'});
    }

});

app.post("/create_agent", async (req, res) => 
{
    

    const { name,
            username,
            password,
            volume,
            min_vol,
            max_users,
            max_days,
            prefix,
            country,
            access_token } = req.body;



    if(!name || !username || !password || !volume || !min_vol || !max_users || !max_days || !prefix || !country) res.send({status:"ERR",msg:"fill all of the inputs"})
    
    else 
    {
        await insert_to_accounts({  id:uid(),
                                    is_admin:0,
                                    disable:0,
                                    name,
                                    username,
                                    password,
                                    volume,
                                    min_vol,
                                    max_users,
                                    max_days,
                                    prefix,
                                    country,
                                    used_traffic:0,
                                    active_users:0,
                                    total_users:0,
                                    tokens:[] 
                                });

        res.send("DONE");
    }

});

app.post("/create_panel", async (req, res) => 
{
    const { panel_name,
            panel_url,
            panel_username,
            panel_password,
            panel_country,
            panel_user_max_count,
            panel_user_max_date,
            panel_traffic,
            access_token } = req.body;




    if(!panel_name || !panel_url || !panel_username || !panel_password || !panel_country || !panel_user_max_count || !panel_user_max_date || !panel_traffic ) res.send({status:"ERR",msg:"fill all of the inputs"})
    
    else 
    {
        await insert_to_panels({    id:uid(),
                                    disable:0,
                                    panel_name,
                                    panel_username,
                                    panel_password,
                                    panel_url,
                                    panel_country,
                                    panel_user_max_count,
                                    panel_user_max_date,
                                    panel_traffic,
                                    active_users:0,
                                    total_users:0,
                                });

        res.send("DONE");
    }
});

app.post("/create_user", async (req, res) => 
{
    const { username, expire, data_limit, access_token } = req.body;

    try {

        var create_user = (await axios.post(API_SERVER_URL + '/api/user/create/',
            {
                username: username,
                expire: parseInt(expire) + parseInt(Date.now() / 1000),
                data_limit: parseInt(data_limit)*((2**10)**3),
                country: "DE"
            },
            { headers: { accept: 'application/json', Authorization: access_token } }));

        res.send("DONE");

        }

    catch (err) 
    {
        console.log(err);
        res.send(send_resp(err));
    }


});

app.post("/delete_agent", async (req, res) => 
{
    var { access_token, agent_id } = req.body;
    await accounts_clct.deleteOne({id:agent_id});
    res.send("DONE");
});

app.post("/delete_panel", async (req, res) => 
{
    var { access_token, panel_id } = req.body;
    await panels_clct.deleteOne({id:panel_id});
    res.send("DONE");
});

app.post("/delete_user", async (req, res) => 
{
    var { access_token,username } = req.body;

    try 
    {
        console.log(username);

        var delete_user = (await axios.delete(API_SERVER_URL + '/api/user/delete/',
            {
                data: { username:username },
                headers: { accept: 'application/json', Authorization: access_token }
            })).data;

        res.send("DONE");
    }

    catch (err) 
    {
        console.log(err);
        res.send(send_resp(err));
    }

});

app.post("/disable_panel", async (req, res) => 
{
    var { access_token, panel_id } = req.body;
    await update_panel(panel_id,{disable:1});
    res.send("DONE");
});

app.post("/disable_agent", async (req, res) => 
{
    var { access_token, agent_id } = req.body;
    await update_account(agent_id,{disable:1});
    res.send("DONE");

});

app.post("/disable_user", async (req, res) => 
{
    var { access_token, username } = req.body;

    try 
    {
        var disable_user = (await axios.put(API_SERVER_URL + '/api/user/edit/',
                { username:username,status:"disabled" },
                {headers: { accept: 'application/json', Authorization: access_token }}
            )).data;

        res.send("DONE");
    }

    catch (err) 
    {
        console.log(err);
        res.send(send_resp(err));
    }

});

app.post("/enable_agent", async (req, res) => 
{
    var { access_token, agent_id } = req.body;
    await update_account(agent_id,{disable:0});
    res.send("DONE");
});

app.post("/enable_panel", async (req, res) => 
{
    var { access_token, panel_id } = req.body;
    await update_panel(panel_id,{disable:0});
    res.send("DONE");
});

app.post("/enable_user", async (req, res) => 
{
    var { access_token, panel_id } = req.body;

    try 
    {
        var enable_panel = (await axios.put(API_SERVER_URL + '/api/admin/panel/enable/',
               { panel_id },
               { headers: { accept: 'application/json', Authorization: access_token } }
            )).data;

        res.send("DONE");
    }

    catch (err) 
    {
        console.log(err);
        res.send(send_resp(err));
    }

});

app.post("/edit_agent", async (req, res) => 
{
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
            access_token } = req.body;


    if(!name || !username || !password || !volume || !min_vol || !max_users || !max_days || !prefix || !country) res.send({status:"ERR",msg:"fill all of the inputs"})
    
    else 
    {
        await update_account(agent_id,{ name,
                                        username,
                                        password,
                                        volume,
                                        min_vol,
                                        max_users,
                                        max_days,
                                        prefix,
                                        country
                                      });
        res.send("DONE");
    }


});

app.post("/edit_panel", async (req, res) => 
{
    const { panel_id,
            panel_name,
            panel_username,
            panel_password,
            panel_user_max_count,
            panel_user_max_date,
            panel_traffic,
            access_token } = req.body;


    if(!panel_name || !panel_username || !panel_password || !panel_user_max_count || !panel_user_max_date || !panel_traffic ) res.send({status:"ERR",msg:"fill all of the inputs"})
   
    else
    { 
        await update_panel(panel_id,{panel_name,
                                     panel_username,
                                     panel_password,
                                     panel_user_max_count,
                                     panel_user_max_date,
                                     panel_traffic,
                                    });
        res.send("DONE");
    }

});

app.post("/edit_user", async (req, res) => 
{
    const { username, expire, data_limit, access_token } = req.body;

    try 
    {

        var edit_user = (await axios.put(API_SERVER_URL + '/api/user/edit/',
            {
                username: username,
                expire: parseInt(expire) + parseInt(Date.now() / 1000),
                data_limit: parseInt(data_limit)*((2**10)**3),
                country: "DE"
            },
            { headers: { accept: 'application/json', Authorization: access_token } }));

        res.send("DONE");
    }

    catch (err) 
    {
        console.log(err);
        res.send(send_resp(err));
        
    }


});



app.listen(5000, () => {
    console.log("--------------");
    console.log("SERVER STARTED !");
    console.log("--------------");
});




