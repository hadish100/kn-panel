const express = require('express');
const app = express();
const axios = require('axios');
const API_SERVER_URL = "http://164.92.143.109";

app.use(express.json());


app.post("/login", async (req,res) => 
{
    const { username , password } = req.body;

    try
    {
        var api_auth_res = (await axios.post('http://164.92.143.109/api/login/',{ username , password },{headers:{'accept': 'application/json','Content-Type': 'application/json'}})).data;
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
        console.log(err);
        res.send("ERR");
    }
    
});

app.listen(5000, () => 
{
    console.log("--------------");
    console.log("SERVER STARTED !");
    console.log("--------------");
});




