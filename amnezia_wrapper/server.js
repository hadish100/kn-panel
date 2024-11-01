require("dotenv").config();
const fs = require('fs').promises;
const express = require('express'); 
const app1 = express();
const app2 = express();

const {    
    generate_token,
    validate_token,
    get_system_status,
    create_user,
    get_user_for_marzban,
    extend_expire_times,
    backup_data,
    get_all_users_for_marzban,
    reset_user_account,
    edit_user,
    delete_user,
    get_real_subscription_url,
} = require('./utils.js');
const path = require("path");

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
        "/sub",
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
        res.send("Invalid api key");
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
    const {username, expire, data_limit, ip_limit} = req.body;
    res.send(await create_user(username, expire, data_limit, ip_limit));
}));

app1.get("/api/user/:vpn_name", custom_handler(async (req, res) =>
{
    res.send(await get_user_for_marzban(req.params.vpn_name));
}));

app1.delete("/api/user/:vpn_name", custom_handler(async (req, res) =>
{
    await delete_user(req.params.vpn_name);
    res.send("OK");
}));

app1.put("/api/user/:vpn_name", custom_handler(async (req, res) =>
{
    var {status,expire,data_limit} = req.body;
    await edit_user(req.params.vpn_name, status, expire, data_limit);
    res.send("OK");
}));

app1.post("/api/user/:vpn_name/reset", custom_handler(async (req, res) =>
{
    await reset_user_account(req.params.vpn_name);
    res.send("OK");
}));

app1.post("/sub", custom_handler(async (req, res) =>
{
    const api_key = req.headers.authorization.split(" ")[1];
    var {installation_uuid} = req.body;
    if(!installation_uuid) throw "Installation uuid not provided";
    res.send(await get_real_subscription_url(api_key,installation_uuid));
}));

app2.post("/get_marzban_users", custom_handler(async (req, res) =>
{
    res.send(await get_all_users_for_marzban());
}));

app2.post("/edit_expire_times", custom_handler(async (req, res) =>
{
    await extend_expire_times(Number(req.body.added_time));
    res.send("OK");
}));

app2.post("/dldb", custom_handler(async (req, res) =>
{
    try
    {


        var new_backup = await backup_data();

        var dbdl_files = await fs.readdir("./dbbu");

        for(var i=0;i<dbdl_files.length;i++)
        {
          if(!dbdl_files[i].endsWith(".zip")) continue;
          var file_path = "./dbbu/" + dbdl_files[i];
          var file_stat = await fs.stat(file_path);
          var diff = new Date() - new Date(file_stat.mtime);
          if(diff > 60*60*24*1000) await fs.unlink(file_path);
        }


        res.sendFile(path.join(__dirname, new_backup));
    }

    catch(err)
    {
        console.log(err);
        res.send("ERR");
    }
}));



app1.listen(process.env.SERVER_PORT , async () => 
{
    console.log(`>>> SERVER STARTED ON PORT ${process.env.SERVER_PORT}`);
});

app2.listen(7002 , async () => 
{
    console.log(`>>> SERVER STARTED ON PORT 7002`);
});

/* 
TODO: 
DOCKERIZE 
FRONTEND CHANGES 
ENABLE DISABLE REAL CONSEQUENCE
UPDATE SUB

COUNTRY SWITCH RELATED ENDPOINTS 
*/