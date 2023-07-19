const express = require('express');
const app = express();
const axios = require('axios');
const API_SERVER_URL = "http://164.92.143.109";

app.use(express.json());



async function get_agents(access_token)
{
    var agents = (await axios.get( API_SERVER_URL + '/api/admin/agents/',{headers:{accept:'application/json',Authorization:access_token}})).data
    return agents;
}

app.post("/get_agents", async (req,res) => 
{
    var { access_token } = req.body;
    var obj = await get_agents(access_token);
    res.send(obj);
});

async function get_panels(access_token)
{
    var panels = (await axios.get( API_SERVER_URL + '/api/admin/panel/view/',{headers:{accept:'application/json',Authorization:access_token}})).data
    return panels;
}

app.post("/get_panels", async (req,res) => 
{
    var { access_token } = req.body;
    var obj = await get_panels(access_token);
    res.send(obj);
});

async function get_users(access_token)
{
    var users = (await axios.get( API_SERVER_URL + '/api/user/view/',{headers:{accept:'application/json',Authorization:access_token}})).data
    return users;
}


app.post("/get_users", async (req,res) => 
{
    var { access_token } = req.body;
    var obj = await get_users(access_token);
    res.send(obj);
});

app.post("/login", async (req,res) => 
{
    const { username,password } = req.body;

    try
    {
        var api_auth_res = (await axios.post( API_SERVER_URL + '/api/login/',{ username , password },{headers:{'accept': 'application/json','Content-Type': 'application/json'}})).data;
        access_token = 'Bearer ' + api_auth_res.access;

        user_data = 
        {
            access_token:access_token,
            is_admin:api_auth_res.user.is_admin  
        };

        res.send(user_data);
    }

    catch(err)
    {
        res.send("ERR");
    }
    
});

app.post("/create_agent", async (req,res) => 
{
    const { name,username,password,volume,min_vol,max_users,max_days,prefix,country,access_token } = req.body;
    
    try
    {
        var panels = await get_panels(access_token);
        var panels_id = []
        for(var i=0;i<panels.length;i++) panels_id.push(panels[i].id);



        var create_agent = (await axios.post( API_SERVER_URL + '/api/admin/agent/create/',
        {
            agent_name:name,
            volume:parseInt(volume),
            maximum_day:parseInt(max_days),
            country:country,
            prefix:prefix,
            username:username,
            password:password,
            panels:panels_id,
            maximum_user:parseInt(max_users),
            minimum_volume:parseInt(min_vol)
        },
        {headers:{accept:'application/json',Authorization:access_token}})).data;
    }

    catch(err)
    {
        res.send("ERR");
    }


});


app.listen(5000, () => 
{
    console.log("--------------");
    console.log("SERVER STARTED !");
    console.log("--------------");
});




