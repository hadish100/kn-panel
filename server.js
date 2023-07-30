const express = require('express');
const app = express();
const axios = require('axios');
const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

app.use(express.json());
const API_SERVER_URL = "http://212.87.214.199";

var db,accounts;
(async function connect_to_db()
{
    await client.connect();
    db = client.db('KN_PANEL');
    accounts = db.collection('accounts');
})();

// --- UTILS --- //


const uid = () => { return Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000; }

const insert_to_accounts = async (obj) => { await accounts.insertOne(obj);return "DONE"; }
const get_accounts = async () => {const result = await accounts.find().toArray();return result;}
const get_account = async (id) => {const result = await accounts.find({id}).toArray();return result[0];}
const update_account = async (id,value) => {await accounts.updateOne({id},{$set:value},function(){});return "DONE";}

const add_token = async (id) => 
{
    var expire = Math.floor(Date.now()/1000) + 3600;
    var token = uid();
    var obj = { token , expire };
    await accounts.updateOne({id},{$push:{tokens:obj}},function(){});return token;
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


// --- ROUTES --- //

app.post("/get_agents", async (req, res) => 
{
    var { access_token } = req.body;
    var obj_arr = [{agent_name:"agent1",disable:false,active_user:10,used_traffic:100,volume:100,weight_dividable:100,prefix:"DE",country:"DE"}];
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

    try 
    {
        var create_agent = (await axios.post(API_SERVER_URL + '/api/admin/agent/create/',
            {
                agent_name: name,
                main_volume: parseInt(volume),
                maximum_day: parseInt(max_days),
                prefix: prefix,
                username: username,
                password: password,
                maximum_user: parseInt(max_users),
                minimum_volume: parseInt(min_vol),
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




