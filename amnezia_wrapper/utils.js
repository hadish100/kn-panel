require("dotenv").config();
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/knaw');
const fs = require('fs').promises;
const JWT_SECRET_KEY = "resllmwriewfeujeh3i3ifdkmwheweljedifefhyr";
const jwt = require('jsonwebtoken');
const child_process = require('child_process');



const uid = () => { return Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000; }

const generate_token = () => { return jwt.sign({},JWT_SECRET_KEY,{expiresIn: '24h'}); }

const b2gb = (bytes) => 
{
    var x = (bytes / (2 ** 10) ** 3);
    return Math.round(x * 100) / 100;
}

const get_now = () =>
{
    return Math.floor(Date.now() / 1000);
}

const get_days_passed = (timestamp) =>
{
    var now = get_now();
    var diff = now - timestamp;
    var days = Math.floor(diff / (60*60*24));
    return days;
}

const validate_token = (token) =>
{
    token = token.replace("bearer ","").replace("Bearer ","");
    try
    {
        var decoded = jwt.verify(token, JWT_SECRET_KEY);
        return decoded;
    }
    
    catch(err)
    {
        return false;
    }
}

const get_system_status = async () =>
{
    var users_arr = await User.find({});
    var result =
    {
        total_user:users_arr.length,
        users_active:users_arr.filter((item) => item.status == "active").length,
        incoming_bandwidth: 0,
        outgoing_bandwidth: 0,
    }

    return result;
}

const create_user = async (username, expire, data_limit) =>
{

    var docker_id = await get_amnezia_container_id();
    if(docker_id == "") throw new Error("Amnezia container not found");


    var private_key = await exec_on_container(docker_id,"wg genkey");
    var public_key = await exec_on_container(docker_id,`echo ${private_key} | wg pubkey`);
    var client_public_key = await exec_on_container(docker_id,`wg show wg0 public-key`);
    var psk = await exec_on_container(docker_id,"wg show wg0 preshared-keys | head -n 1");
    psk = psk.split("\t")[1];
    var dedicated_ip = await get_next_available_ip();

    var interface = await get_wg0_interface();
    var clients_table = await get_amnezia_clients_table();

    var new_interface =
`
${interface}
[Peer]
PublicKey = ${public_key}
PresharedKey = ${psk}
AllowedIPs = ${dedicated_ip}

`

    /*
    
    {
        "clientId": "ueEoTIXSR0sXvYjysmwDtjbG7+g/pRce2rqX4h2DoEg=",
        "userData": {
            "clientName": "New client666",
            "creationDate": "Sun Oct 13 05:14:28 2024"
        }
    }
    
        */

    var creation_date = new Date(expire * 1000).toString().split(" GMT")[0];

    creation_date = creation_date.split(" ");
    var temp = creation_date[creation_date.length - 1];
    creation_date[creation_date.length - 1] = creation_date[creation_date.length - 2];
    creation_date[creation_date.length - 2] = temp;
    creation_date = creation_date.join(" ");

    clients_table.push(
    {
        clientId: public_key,
        userData:
        {
            clientName: username,
            creationDate: creation_date,
        }
    });

    await replace_wg0_interface(new_interface);
    await replace_amnezia_clients_table(JSON.stringify(clients_table,null,4));


    var subscription_url =
`

[Interface]
Address = ${dedicated_ip}
DNS = 1.1.1.1, 1.0.0.1
PrivateKey = ${private_key}
Jc = 4
Jmin = 10
Jmax = 50
S1 = 108
S2 = 18
H1 = 548102439
H2 = 96202383
H3 = 1018342978
H4 = 415451259

[Peer]
PublicKey = ${client_public_key}
PresharedKey = ${psk}
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = ${process.env.SERVER_ADDRESS}
PersistentKeepalive = 25
`

    var result =
    {
        links: ["AWG","AWG","AWG","AWG"],
        subscription_url: subscription_url,
    }

    await User.create(
    {
        username: username,
        expire: expire,
        data_limit: data_limit,
        connection_string: subscription_url,
    });

    await sync_configs();

    return result;

}

const get_user_for_marzban = async (username) =>
{
    const result =
    {
        proxies: {
            "trojan": {
              "password": "AWG",
              "flow": ""
            },
            "vless": {
              "id": "AWG",
              "flow": ""
            },
            "vmess": {
              "id": "AWG"
            },
            "shadowsocks": {
              "password": "AWG",
              "method": "AWG"
            }
          },

          links: ["AWG","AWG","AWG","AWG"],
          lifetime_used_traffic: 0,
          subscription_url: (await User.findOne({username})).connection_string,
    }

    return result;
}

async function exec(cmd)
{

    if (process.platform !== 'linux') 
    {
      return '';
    }

    return new Promise((resolve, reject) => 
    {
      child_process.exec(cmd, 
      {
        shell: 'bash',
      }, 
      (err, stdout) => 
      {
        if (err) return reject(err);
        console.log(stdout);
        return resolve(String(stdout).trim());
      });
    });
}

async function exec_on_container(container_id, cmd)
{
    return await exec(`docker exec ${container_id} ${cmd}`);
}

async function sync_configs()
{
    var container_id = await get_amnezia_container_id();
    await exec_on_container(container_id,'bash -c "cd /opt/amnezia/awg/ && wg syncconf wg0 <(wg-quick strip ./wg0.conf)"');
}

async function get_wg0_interface()
{
    var container_id = await get_amnezia_container_id();
    return await exec_on_container(container_id,"cat /opt/amnezia/awg/wg0.conf");
}

async function get_amnezia_clients_table()
{
    var container_id = await get_amnezia_container_id();
    var clients_table_raw = await exec_on_container(container_id,"cat /opt/amnezia/awg/clientsTable");
    return JSON.parse(clients_table_raw);
}

async function get_amnezia_container_id()
{
    return await exec("docker ps -qf name=amnezia-awg");
}

async function replace_wg0_interface(new_config)
{
    var container_id = await get_amnezia_container_id();
    var file_id = uid()
    await fs.writeFile(`./temp${file_id}`,new_config);
    await exec(`docker cp ./temp${file_id} ${container_id}:/opt/amnezia/awg/wg0.conf`);
    await fs.unlink(`./temp${file_id}`);
}

async function replace_amnezia_clients_table(new_table)
{
    var container_id = await get_amnezia_container_id();
    var file_id = uid()
    await fs.writeFile(`./temp${file_id}`,new_table);
    await exec(`docker cp ./temp${file_id} ${container_id}:/opt/amnezia/awg/clientsTable`);
    await fs.unlink(`./temp${file_id}`);
}

async function get_next_available_ip()
{
    var interface = await get_wg0_interface();

    var ips = interface.split("\n").filter((item) => item.includes("AllowedIPs"));
    var ips_arr = ips.map((item) => item.split(" = ")[1]);
    ips_arr = ips_arr.map((item) => item.split("/")[0]);
    var last_ip = ips_arr[ips_arr.length - 1];
    var last_ip_arr = last_ip.split(".");
    if(last_ip_arr[3] == 255)
    {
        last_ip_arr[3] = 0;
        last_ip_arr[2] = parseInt(last_ip_arr[2]) + 1;
    }
    else if(last_ip_arr[2] == 255)
    {
        last_ip_arr[2] = 0;
        last_ip_arr[1] = parseInt(last_ip_arr[1]) + 1;
    }
    else if(last_ip_arr[1] == 255)
    {
        last_ip_arr[1] = 0;
        last_ip_arr[0] = parseInt(last_ip_arr[0]) + 1
    }
    else if(last_ip_arr[0] == 255)
    {
        throw new Error("No more available IPs");
    }
    else
    {
        last_ip_arr[3] = parseInt(last_ip_arr[3]) + 1;
    }

    return last_ip_arr.join(".") + "/32";

}


const user_schema = new mongoose.Schema(
{
    username: String,
    expire: Number,
    data_limit: Number,
    data_usage: { type: Number, default: 0 },
    status: { type: String, default: "active", enum: ["active","limited","expired","disabled"] },
    created_at: { type: Date, default: Date.now },
    connection_string: String,
});

const User = mongoose.model('User', user_schema);


module.exports = 
{
    uid,
    generate_token,
    b2gb,
    get_now,
    validate_token,
    get_days_passed,
    get_system_status,
    create_user,
    get_user_for_marzban,
}