require("dotenv").config();
const express = require('express'); 
const app1 = express();
const app2 = express();


const {    
    generate_token,
    validate_token,
    get_system_status,
    create_user,
    get_user_for_marzban,
} = require('./utils.js');

const custom_handler = (fn) => (req, res) => 
{
    Promise.resolve(fn(req, res)).catch
    (
        (err) => 
        {
            console.error(err);
            res.status(500).send({detail:"Internal Server Error"});
        }
    );
};

app1.use(express.urlencoded({extended: true}));
app2.use(express.urlencoded({extended: true}));
app1.use(express.json());
app2.use(express.json());
app1.use(auth1);
app2.use(auth2);


async function auth1(req, res, next)
{

    const guest_endpoints = 
    [
        "/ping",
        "/api/admin/token",
    ];



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
            else res.status(401).send({detail: "Not authenticated"});
        }
        
        else
        {
            res.status(401).send({detail: "Not authenticated"});
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
    if(req.body.username == process.env.SUDO_USERNAME && req.body.password == process.env.SUDO_PASSWORD)
    {
        res.send
        ({
            access_token: generate_token(),
            token_type: "bearer"
        });
    }

    else
    {
        res.status(401).send({detail: "Incorrect username or password"});
    }
}));

app1.get("/api/system", custom_handler(async (req, res) =>
{
    res.send(await get_system_status());
}));

app1.get("/api/inbounds", custom_handler(async (req, res) =>
{
    res.send
    ({
        "trojan": 
        [
            {
            "tag": "AWG_INBOUND",
            "protocol": "trojan",
            "network": "tcp",
            "tls": "tls",
            "port": 8000
            }
        ],
        "vless": 
        [
            {
            "tag": "AWG_INBOUND",
            "protocol": "vless",
            "network": "ws",
            "tls": "tls",
            "port": 8000
            }
        ],
        "vmess": 
        [
            {
            "tag": "AWG_INBOUND",
            "protocol": "vmess",
            "network": "ws",
            "tls": "tls",
            "port": 8000
            }
        ],
        "shadowsocks": 
        [
            {
            "tag": "AWG_INBOUND",
            "protocol": "shadowsocks",
            "network": "tcp",
            "tls": "none",
            "port": 8000
            }
        ]
    })
}));

app1.post("/api/user", custom_handler(async (req, res) =>
{
    const {username, expire, data_limit} = req.body;
    res.send(await create_user(username, expire, data_limit));
}));

app1.get("/api/user/:vpn_name", custom_handler(async (req, res) =>
{
    res.send(await get_user_for_marzban(req.params.vpn_name));
}));

app1.delete("/api/user/:vpn_name", custom_handler(async (req, res) =>
{
    throw new Error("Not implemented");
}));

app1.put("/api/user/:vpn_name", custom_handler(async (req, res) =>
{
    throw new Error("Not implemented");
}));

app1.post("/api/user/:vpn_name/reset", custom_handler(async (req, res) =>
{
    throw new Error("Not implemented");
}));

app2.get("/get_marzban_users", custom_handler(async (req, res) =>
{
    throw new Error("Not implemented");
}));

app2.get("/edit_expire_times", custom_handler(async (req, res) =>
{
    throw new Error("Not implemented");
}));

app2.post("/dldb", custom_handler(async (req, res) =>
{
    throw new Error("Not implemented");
}));



app1.listen(7001 , async () => 
{
    console.log(`>>> SERVER STARTED ON PORT 7001`);
});

app2.listen(7002 , async () => 
{
    console.log(`>>> SERVER STARTED ON PORT 7002`);
});

/* 
TODO: 
COUNTRY SWITCH RELATED ENDPOINTS 
DOCKERIZE 
FRONTEND CHANGES 
SYNC 
BROADCAST TO CUSTOMERS 
LOCAL OR UNLOCAL? 
ENV variables
INNER SYNC
*/