const express = require('express'); 
const app1 = express();
const app2 = express();


const {} = require('./utils.js');

const custom_handler = (fn) => (req, res) => 
{
    Promise.resolve(fn(req, res)).catch
    (
        (err) => 
        {
            console.error(err);
            res.send({status:"ERR",code:500,msg:"Internal Server Error"});
        }
    );
};
   

app1.use(auth1);
app2.use(auth2);


async function auth1(req, res, next)
{

    const guest_endpoints = [];



        if (guest_endpoints.includes(req.url))
        {
            next();
        }

    else
    {
        var token = req.headers.authorization;
        if(token)
        {
            var decoded = validate_token(token);
            if(decoded) next();
            else res.send({status:"ERR",code:603,msg:"Invalid token"});
        }
        
        else
        {
            res.send({status:"ERR",code:604,msg:"No token provided"});
        }
    }
}


async function auth2(req, res, next)
{
    var {api_key} = req.body;

    if (api_key != "resllmwriewfeujeh3i3ifdkmwheweljedifefhyr")
    {
        res.send("invalid api key");
        return;
    }

    next();
}




app1.post("/ping", custom_handler(async (req, res) =>
{
    res.send("PONG");
}));

app2.post("/ping", custom_handler(async (req, res) =>
{
    res.send("PONG");
}));

app1.post("/api/admin/token", custom_handler(async (req, res) =>
{

}));

app1.get("/api/system", custom_handler(async (req, res) =>
{

}));

app1.get("/api/inbounds", custom_handler(async (req, res) =>
{

}));

app1.post("/api/user", custom_handler(async (req, res) =>
{

}));

app1.delete("/api/user/:vpn_name", custom_handler(async (req, res) =>
{

}));

app1.put("/api/user/:vpn_name", custom_handler(async (req, res) =>
{

}));

app1.post("/api/user/:vpn_name/reset", custom_handler(async (req, res) =>
{

}));

app1.post("/api/core/restart", custom_handler(async (req, res) =>
{

}));

app2.get("/get_marzban_users", custom_handler(async (req, res) =>
{

}));

app2.get("/edit_expire_times", custom_handler(async (req, res) =>
{

}));

app2.post("/dldb", custom_handler(async (req, res) =>
{

}));



app1.listen(80 , async () => 
{
    console.log(`>>> SERVER STARTED ON PORT 80`);
});

app2.listen(7002 , async () => 
{
    console.log(`>>> SERVER STARTED ON PORT 7002`);
});