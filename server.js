const express = require('express');const app = express();
const axios = require('axios');
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

app.use(express.json());
app.use(auth_middleware);


var db,accounts_clct;
(async function connect_to_db()
{
    await client.connect();
    db = client.db('KN_PANEL');
    accounts_clct = db.collection('accounts');
})();

// --- UTILS --- //

const uid = () => { return Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000; }

const uidv2 = () => 
{
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 20) 
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

function send_resp(err)
{
    if(!err.response) return {status:"ERR",msg:(err.code || "An error occurred")}
    return {status:"ERR",msg:(err.response.data.detail || Object.keys(err.response.data)[0] + " : " + err.response.data[Object.keys(err.response.data)[0]])}
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

async function get_users(access_token) 
{
    var users = (await axios.get(API_SERVER_URL + '/api/user/view/', { headers: { accept: 'application/json', Authorization: access_token } })).data
    var inner_users = users.users;
    inner_users.map(x=>x.temp_id = uid());
    users.users = inner_users;
    return users;
}


// --- MIDDLEWARE --- //

async function auth_middleware(req, res, next)
{
    if(req.url == "/login") return next();
    var access_token = req.body.access_token;
    var account = await token_to_account(access_token);
    if(!account) return res.status(400).send({message: 'NOT FOUND'});
    else return next();
}

async function log_middleware(req, res, next)
{
    console.log("HI");
}

// --- ENDPOINTS --- //

app.post("/get_agents", async (req, res) => 
{
    var {access_token} = req.body;
    var admin_id = (await token_to_account(access_token)).id;
    var obj_arr = await accounts_clct.find({is_admin:0,admin_id}).toArray();
    console.log(obj_arr);
    res.send(obj_arr);
});

app.post("/get_panels", async (req, res) => 
{
    var { access_token } = req.body;
    var obj_arr = [{panel_name:"test",panel_disable:false,panel_traffic:100,active_user:10,total_user:100,panel_user_max_count:100,country:"DE"}];
    res.send(obj_arr);
});

app.post("/get_users", async (req, res) => 
{
    var { access_token } = req.body;
    var obj = await get_users(access_token);
    res.send(obj);
});

app.post("/get_agent", async (req, res) => 
{
    var { access_token } = req.body;
    var agent = (await axios.get(API_SERVER_URL + '/api/agent/', { headers: { accept: 'application/json', Authorization: access_token } })).data
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
        res.status(400).send({message: 'NOT FOUND'});
    }

});

app.post("/create_agent", async (req, res) => 
{
    const admin_id = (await token_to_account(req.body.access_token)).id;

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


    await insert_to_accounts({  id:uid(),
                                admin_id,
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
                                allocatable_data:volume,
                                active_users:0,
                                tokens:[] });
    res.send("DONE");
});

app.post("/create_panel", async (req, res) => 
{
    const { panel_name, panel_url, panel_username, panel_password, panel_country, panel_user_max_count, panel_user_max_date, panel_traffic, access_token } = req.body;

    try 
    {

        var create_panel = (await axios.post(API_SERVER_URL + '/api/admin/panel/create/',
            {
                panel_name: panel_name,
                panel_url: panel_url,
                panel_username: panel_username,
                panel_password: panel_password,
                panel_country: panel_country,
                panel_user_max_count: parseInt(panel_user_max_count),
                panel_user_max_date: parseInt(panel_user_max_date),
                panel_traffic: parseInt(panel_traffic),
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

    try 
    {
        var delete_agent = (await axios.delete(API_SERVER_URL + '/api/admin/agent/delete/',
            {
                data: { agent_id: agent_id },
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

app.post("/delete_panel", async (req, res) => 
{
    var { access_token, panel_id } = req.body;

    try 
    {
        var delete_panel = (await axios.delete(API_SERVER_URL + '/api/admin/panel/delete/',
        {
            data: { panel_id: panel_id },
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

    try 
    {
        var disable_panel = (await axios.put(API_SERVER_URL + '/api/admin/panel/disable/',
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

app.post("/disable_agent", async (req, res) => 
{
    var { access_token, agent_id } = req.body;

    try 
    {
        var disable_agent = (await axios.put(API_SERVER_URL + '/api/admin/agent/disable/',
                { agent_id },
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

    try 
    {
        var enable_agent = (await axios.put(API_SERVER_URL + '/api/admin/agent/enable/',
                { agent_id },
                {headers: { accept: 'application/json', Authorization: access_token }}
            )).data;

        res.send("DONE");
    }

    catch (err) {
        console.log(err);
        res.send(send_resp(err));
    }

});

app.post("/enable_panel", async (req, res) => 
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

app.post("/edit_agent", async (req, res) => 
{
    const { agent_id,agent_name,username,password,volume,minimum_volume,maximum_user,maximum_day,prefix,country, access_token } = req.body;

    try 
    {

        var edit_agent = (await axios.put(API_SERVER_URL + '/api/admin/agent/edit/',
        {
            agent_id:agent_id,
            agent_name: agent_name,
            main_volume: parseInt(volume),
            maximum_day: parseInt(maximum_day),
            prefix: prefix,
            username: username,
            password: password,
            maximum_user: parseInt(maximum_user),
            minimum_volume: parseInt(minimum_volume),
            access_country_panel:["DE"]
        },
        { headers: { accept: 'application/json', Authorization: access_token } })).data;

        res.send("DONE");
    }

    catch (err) 
    {
        console.log(err);
        res.send(send_resp(err));
    }


});

app.post("/edit_panel", async (req, res) => 
{
    const { panel_name, panel_url, panel_username, panel_password, panel_country, panel_user_max_count, panel_user_max_date, panel_traffic, access_token } = req.body;

    try 
    {

        var edit_panel = (await axios.put(API_SERVER_URL + '/api/admin/panel/edit/',
        {
            panel_name: panel_name,
            panel_url: panel_url,
            panel_username: panel_username,
            panel_password: panel_password,
            panel_country: panel_country,
            panel_user_max_count: parseInt(panel_user_max_count),
            panel_user_max_date: parseInt(panel_user_max_date),
            panel_traffic: parseInt(panel_traffic),
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




