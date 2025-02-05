require("dotenv").config();
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/knaw');
const fs = require('fs').promises;
const {JWT_SECRET_KEY} = process.env
const {SUB_JWT_SECRET} = process.env
const jwt = require('jsonwebtoken');
const child_process = require('child_process');
const AdmZip = require('adm-zip');
const jalali_moment = require('jalali-moment');
const cron = require('node-cron');

String.prototype.farsify = function()
{
    return this.replace(/0/g, '۰').replace(/1/g, '۱').replace(/2/g, '۲').replace(/3/g, '۳').replace(/4/g, '۴').replace(/5/g, '۵').replace(/6/g, '۶').replace(/7/g, '۷').replace(/8/g, '۸').replace(/9/g, '۹');
}

const uid = () => { return Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000; }

const generate_token = () => { return jwt.sign({},JWT_SECRET_KEY,{expiresIn: '24h'}); }

const to_unicode_escape = (str) => 
{
    return str.split('').map(char => 
    {
        const code = char.charCodeAt(0).toString(16).padStart(4, '0');
        return `\\u${code}`;
    }).join('');
};

const b2gb = (bytes) => 
{
    var x = (bytes / (2 ** 10) ** 3);
    return Math.round(x * 100) / 100;
}

const gb2b = (gb) =>
{
    return gb * (2 ** 10) ** 3;
}

const sleep = (seconds) => { return new Promise((resolve) => { setTimeout(resolve, seconds * 1000); }); }

const format_amnezia_data_to_byte = (str) =>
{
    if(!str) return 0;
    const unit = str.split(" ")[1];
    var value = str.split(" ")[0]; 
    value = parseFloat(value);
    if(unit == "KiB") return Math.round(value * 1024);
    if(unit == "MiB") return Math.round(value * 1024 * 1024);
    if(unit == "GiB") return Math.round(value * 1024 * 1024 * 1024);
    if(unit == "TiB") return Math.round(value * 1024 * 1024 * 1024 * 1024);
    else return 0;
}

const get_user_traffic_from_wg_cli = async (public_key) =>
{
    try
    {
        var container_id = await get_amnezia_container_id();
        var data = await exec_on_container(container_id,`wg show wg0 transfer | grep ${public_key}`);
        var data_arr = data.split("\t");
        var received = data_arr[1];
        var sent = data_arr[2];
        console.log(`Received: ${received}, Sent: ${sent}`);
        return parseInt(received) + parseInt(sent);
    }

    catch(err)
    {
        console.log(err);
        return false;
    }
}

const get_now = () =>
{
    return Math.floor(Date.now() / 1000);
}

const ts__to__pd = (ts) => 
{

    if(ts > 9999999999) ts = Math.floor(ts / 1000);

    var months =
    {
        1:"فروردین",
        2:"اردیبهشت",
        3:"خرداد",
        4:"تیر",
        5:"مرداد",
        6:"شهریور",
        7:"مهر",
        8:"آبان",
        9:"آذر",
        10:"دی",
        11:"بهمن",
        12:"اسفند",
    }

    var result = 
    {
        year:jalali_moment.unix(ts).locale('fa').format('YYYY').farsify(),
        month:months[jalali_moment.unix(ts).locale('fa').format('M')],
        day:jalali_moment.unix(ts).locale('fa').format('DD').farsify(),
    }

    return result;
}

const get_days_passed = (timestamp) =>
{
    var now = get_now();
    var diff = now - timestamp;
    var days = Math.floor(diff / (60*60*24));
    return days;
}

const get_days_left = (timestamp) =>
{
    var now = get_now();
    var diff = timestamp - now;
    var days = Math.floor(diff / (60*60*24));
    return days + 1;
}

const generate_desc = (expire, ip_limit) =>
{
    var expire_date = ts__to__pd(expire);
    var desc = "انقضا: "
    desc += expire_date.day + " " + expire_date.month + " " + expire_date.year;
    desc += "|"
    desc += String(get_days_left(expire)).farsify() + " روزه";
    desc += "|"
    desc += String(ip_limit).farsify() + " کاربره";

    return to_unicode_escape(desc);
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
        console.log(err,JWT_SECRET_KEY);
        return false;
    }
}

const get_system_status = async () =>
{

    const users = await User.find();

    var result =
    {
        total_user: users.length,
        users_active: users.filter((item) => item.status == "active").length,
        incoming_bandwidth: users.reduce((acc, item) => acc + item.lifetime_used_traffic + item.used_traffic, 0),
        outgoing_bandwidth: 0,
        panel_type:"AMN",
    }

    return result;
}

const extend_expire_times = async (added_time) =>
{
    await User.updateMany({},{$inc: {expire: added_time}});
}

const create_user = async (username, expire, data_limit, ip_limit, unlock=false) =>
{

    const does_exist = await User.findOne({username});

    if(!unlock)
    {
        if(does_exist) throw new Error("User already exists");
        const username_regex = /^[a-zA-Z0-9_]+$/;
        if(!username.match(username_regex)) throw new Error("Invalid username");
    }

    else if(unlock && !does_exist) throw new Error("User not found");

    var docker_id = await get_amnezia_container_id();
    if(docker_id == "") throw new Error("Amnezia container not found");


    var private_key = await exec_on_container(docker_id,"wg genkey");
    var public_key = await exec_on_container(docker_id,`echo ${private_key} | wg pubkey`);
    var client_public_key = await exec_on_container(docker_id,`wg show wg0 public-key`);
    var psk = await exec_on_container(docker_id,"wg show wg0 preshared-keys | head -n 1");
    psk = psk.split("\t")[1];
    
    var interface = await get_wg0_interface();
    var clients_table = await get_amnezia_clients_table();

    var dedicated_ip = null;
    if(!unlock) dedicated_ip = await get_next_available_ip();
    else
    {
        var interface_lines = interface.split("\n");
        var public_key_line_index = interface_lines.findIndex((item) => item.includes(does_exist.public_key));
        dedicated_ip = interface_lines[public_key_line_index + 2].split(" = ")[1];
    }

    const Jc_value = get_interface_key(interface,"Jc");
    const Jmin_value = get_interface_key(interface,"Jmin");
    const Jmax_value = get_interface_key(interface,"Jmax");
    const S1_value = get_interface_key(interface,"S1");
    const S2_value = get_interface_key(interface,"S2");
    const H1_value = get_interface_key(interface,"H1");
    const H2_value = get_interface_key(interface,"H2");
    const H3_value = get_interface_key(interface,"H3");
    const H4_value = get_interface_key(interface,"H4");
    const amnezia_port = get_interface_key(interface,"ListenPort");


    var new_interface = null;

    if(unlock)
    {
        new_interface = interface;
        new_interface = new_interface.replace(`PublicKey = ${does_exist.public_key}`,`PublicKey = ${public_key}`);
    }

    else
    {
        new_interface =
`${interface}
[Peer]
PublicKey = ${public_key}
PresharedKey = ${psk}
AllowedIPs = ${dedicated_ip}

`
    }



    var connection_string =
`

[Interface]
Address = ${dedicated_ip}
DNS = 1.1.1.1, 1.0.0.1
PrivateKey = ${private_key}
Jc = ${Jc_value}
Jmin = ${Jmin_value}
Jmax = ${Jmax_value}
S1 = ${S1_value}
S2 = ${S2_value}
H1 = ${H1_value}
H2 = ${H2_value}
H3 = ${H3_value}
H4 = ${H4_value}

[Peer]
PublicKey = ${client_public_key}
PresharedKey = ${psk}
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = ${process.env.SERVER_ADDRESS}:${amnezia_port}
PersistentKeepalive = 25
`;

    var subscription_url_raw = 
    {
        config_version:1,
        api_endpoint:`https://${process.env.ENDPOINT_ADDRESS}/sub`,
        protocol:"awg",
        name:process.env.COUNTRY_EMOJI + " " + username,
        description:generate_desc(expire,ip_limit),
        api_key:jwt.sign({username},SUB_JWT_SECRET),
    }

    var subscription_url = null;
    if(!unlock) subscription_url = await encode_amnezia_data(JSON.stringify(subscription_url_raw));

    console.log(subscription_url);


    var real_subscription_url_raw =
    {
        "containers": [
            {
                "awg": {
                    "H1": `${H1_value}`,
                    "H2": `${H2_value}`,
                    "H3": `${H3_value}`,
                    "H4": `${H4_value}`,
                    "Jc": `${Jc_value}`,
                    "Jmax": `${Jmax_value}`,
                    "Jmin": `${Jmin_value}`,
                    "S1": `${S1_value}`,
                    "S2": `${S2_value}`,
                    "last_config": `{\n    \"H1\": \"${H1_value}\",\n    \"H2\": \"${H2_value}\",\n    \"H3\": \"${H3_value}\",\n    \"H4\": \"${H4_value}\",\n    \"Jc\": \"${Jc_value}\",\n    \"Jmax\": \"${Jmax_value}\",\n    \"Jmin\": \"${Jmin_value}\",\n    \"S1\": \"${S1_value}\",\n    \"S2\": \"${S2_value}\",\n    \"allowed_ips\": [\n        \"0.0.0.0/0\",\n        \"::/0\"\n    ],\n    \"clientId\": \"${public_key}\",\n    \"client_ip\": \"${dedicated_ip.split("/")[0]}\",\n    \"client_priv_key\": \"${private_key}\",\n    \"client_pub_key\": \"${public_key}\",\n    \"config\": \"[Interface]\\nAddress = ${dedicated_ip}\\nDNS = $PRIMARY_DNS, $SECONDARY_DNS\\nPrivateKey = ${private_key}\\nJc = ${Jc_value}\\nJmin = ${Jmin_value}\\nJmax = ${Jmax_value}\\nS1 = ${S1_value}\\nS2 = ${S2_value}\\nH1 = ${H1_value}\\nH2 = ${H2_value}\\nH3 = ${H3_value}\\nH4 = ${H4_value}\\n\\n[Peer]\\nPublicKey = ${client_public_key}\\nPresharedKey = ${psk}\\nAllowedIPs = 0.0.0.0/0, ::/0\\nEndpoint = ${process.env.SERVER_ADDRESS}:${amnezia_port}\\nPersistentKeepalive = 25\\n\",\n    \"hostName\": \"${process.env.SERVER_ADDRESS}\",\n    \"mtu\": \"1280\",\n    \"persistent_keep_alive\": \"25\",\n    \"port\": ${amnezia_port},\n    \"psk_key\": \"${psk}\",\n    \"server_pub_key\": \"${client_public_key}\"\n}\n`,
                    "port": `${amnezia_port}`,
                    "transport_proto": "udp"
                },
                "container": "amnezia-awg"
            }
        ],
        "defaultContainer": "amnezia-awg",
        "description": "AWG Server",
        "dns1": "1.1.1.1",
        "dns2": "1.0.0.1",
        "hostName": `${process.env.SERVER_ADDRESS}`,
    }

    var real_subscription_url = await encode_amnezia_data(JSON.stringify(real_subscription_url_raw));


    var creation_date = new Date(expire * 1000).toString().split(" GMT")[0];

    creation_date = creation_date.split(" ");
    var temp = creation_date[creation_date.length - 1];
    creation_date[creation_date.length - 1] = creation_date[creation_date.length - 2];
    creation_date[creation_date.length - 2] = temp;
    creation_date = creation_date.join(" ");


    if(unlock)
    {
        clients_table = clients_table.map((item) =>
        {
            if(item.userData.clientName == username)
            {
                item.clientId = public_key;
            }

            return item;
        });
    }

    else
    {
        clients_table.push
        ({
            clientId: public_key,
            userData:
            {
                clientName: username,
                creationDate: creation_date,
            }
        });
    }
        

    await replace_wg0_interface(new_interface);
        
    await replace_amnezia_clients_table(JSON.stringify(clients_table,null,4));

    if(unlock)
    {
        await User.updateOne({username},
        {
            connection_string: connection_string,
            real_subscription_url: real_subscription_url,
            public_key: public_key,
            connection_uuids: [],
            has_been_unlocked: true,
        });
    }

    else
    {
        await User.create
        ({
            username: username,
            expire: expire,
            data_limit: data_limit,
            connection_string: connection_string,
            subscription_url: subscription_url,
            real_subscription_url: real_subscription_url,
            public_key: public_key,
            maximum_connections: ip_limit,
        });
    }
            
    await sync_configs();

    return {
        links: [connection_string],
        subscription_url: subscription_url,
    }

}

const get_user_for_marzban = async (username) =>
{

    const user = await User.findOne({username});

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

          links: [user.connection_string],
          lifetime_used_traffic: user.lifetime_used_traffic + user.used_traffic,
          subscription_url: user.subscription_url,
          ip_limit: user.maximum_connections,
    }

    return result;
}

const get_all_users_for_marzban = async () =>
{

    const users = await User.find({},
    {   
        username: 1,
        expire: 1,
        data_limit: 1,
        used_traffic: 1,
        lifetime_used_traffic: 1,
        status: 1,
        created_at: 1,
        subscription_url: 1,
    }).lean()


    for(let user of users)
    {
        user.lifetime_used_traffic = user.lifetime_used_traffic + user.used_traffic;
        user.created_at = format_timestamp(user.created_at);
    }


    return {
        users,
    }

}

const format_timestamp = (timestamp) =>
{
    var date = new Date(timestamp * 1000);
    
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');
    let milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}000`;
}

const reset_user_account = async (username) =>
{
    const user_obj = await User.findOne({username});
    await User.updateOne({username}, {used_traffic: 0, lifetime_used_traffic: user_obj.lifetime_used_traffic + user_obj.used_traffic});
    return true;
}

const edit_user = async (username, status, expire, data_limit) =>
{
    if(status) 
    {
        await User.updateOne({username}, {status});
        return true;
    }

    const user_obj = await User.findOne({username});

    if(get_days_left(user_obj.expire) != get_days_left(expire))
    {
        await User.updateOne({username}, {expire, data_limit, used_traffic: 0, lifetime_used_traffic: user_obj.lifetime_used_traffic + user_obj.used_traffic});
        return true;
    }
    
    await User.updateOne({username}, {data_limit, expire});
    return true;
}

const delete_user = async (username) =>
{

    var interface = await get_wg0_interface();
    var clients_table = await get_amnezia_clients_table();
    const user_obj = await User.findOne({username});
    if(!user_obj) throw new Error("User not found");
    var public_key = user_obj.public_key;

    clients_table = clients_table.filter((item) => item.userData.clientName != username);

    var interface_lines = interface.split("\n");

    for(var i=0;i<interface_lines.length;i++)
    {
        if(interface_lines[i].includes(public_key))
        {
            interface_lines.splice(i-1,4);
            break;
        }
    }

    await replace_wg0_interface(interface_lines.join("\n"));

    await replace_amnezia_clients_table(JSON.stringify(clients_table,null,4));

    await sync_configs();

    await User.deleteOne({ username });
    return true;
}

const exec = async (cmd) =>
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
        // console.log(stdout);
        return resolve(String(stdout).trim());
      });
    });
}

const exec_on_container = async (container_id, cmd) =>
{
    return await exec(`docker exec ${container_id} ${cmd}`);
}

const exec_on_container_sh = async (container_id, cmd) =>
{
    return await exec(`docker exec ${container_id} sh -c "${cmd}"`);
}

const sync_configs = async () =>
{
    var container_id = await get_amnezia_container_id();
    await exec_on_container(container_id,'bash -c "cd /opt/amnezia/awg/ && wg syncconf wg0 <(wg-quick strip ./wg0.conf)"');
}

const get_wg0_interface = async () =>
{
    var container_id = await get_amnezia_container_id();
    return await exec_on_container(container_id,"cat /opt/amnezia/awg/wg0.conf");
}

const get_interface_key = (interface, key) =>
{
    var lines = interface.split("\n");
    for(var line of lines)
    {
        if(line.includes(key + " = "))
        {
            return line.split(" = ")[1];
        }
    }
}

const get_amnezia_clients_table = async () =>
{
    var container_id = await get_amnezia_container_id();
    var clients_table_raw = await exec_on_container(container_id,"cat /opt/amnezia/awg/clientsTable");
    return JSON.parse(clients_table_raw);
}

const get_amnezia_container_id = async () =>
{
    return await exec("docker ps -qf name=amnezia-awg");
}

const replace_wg0_interface = async (new_config) =>
{
    var container_id = await get_amnezia_container_id();
    var file_id = uid()
    await fs.writeFile(`./temp${file_id}`,new_config);
    await exec(`docker cp ./temp${file_id} ${container_id}:/opt/amnezia/awg/wg0.conf`);
    await fs.unlink(`./temp${file_id}`);
}

const replace_amnezia_clients_table = async (new_table) =>
{
    var container_id = await get_amnezia_container_id();
    var file_id = uid()
    await fs.writeFile(`./temp${file_id}`,new_table);
    await exec(`docker cp ./temp${file_id} ${container_id}:/opt/amnezia/awg/clientsTable`);
    await fs.unlink(`./temp${file_id}`);
}

const get_real_subscription_url = async (api_key,installation_uuid) =>
{
    var decoded = jwt.verify(api_key, SUB_JWT_SECRET);
    console.log(`===>Serving subscription url for ${decoded.username}`);
    var user = await User.findOne({username: decoded.username});
    // console.log(user);
    if(!user.connection_uuids.includes(installation_uuid))
    {
        if(user.connection_uuids.length >= user.maximum_connections) throw new Error("Maximum connections reached");
        else
        {
            await User.updateOne({username: user.username}, {connection_uuids: [...user.connection_uuids, installation_uuid]});
        }
    }

    return {
        config: user.real_subscription_url,
    }
}

const update_users_subscription_desc = async () =>
{
    const users = await User.find();

    console.log("===> Updating Sub Links");

    for(let user of users)
    {
        if(user.connection_uuids.length == 0 && !user.has_been_unlocked && user.created_at + 86400 < get_now())
        {

            const new_expire = get_now() + user.expire - user.created_at;

            var subscription_url_raw = 
            {
                config_version:1,
                api_endpoint:`https://${process.env.ENDPOINT_ADDRESS}/sub`,
                protocol:"awg",
                name:process.env.COUNTRY_EMOJI + " " + user.username,
                description:generate_desc(new_expire,user.maximum_connections),
                api_key:jwt.sign({username:user.username},SUB_JWT_SECRET),
            }
        

            const subscription_url = await encode_amnezia_data(JSON.stringify(subscription_url_raw));

            await User.updateOne({username: user.username},
            {
                subscription_url,
                expire: new_expire,
            });

            console.log(`User ${user.username} subscription updated`);
        }
    }

    console.log("===> Sub Links Updated");
}

const unlock_user_account = async (username) =>
{
    await create_user(username,0,0,0,true);
}

const decode_base64_data = (data) =>
{
    return Buffer.from(data, 'base64').toString('ascii');
}

const encode_base64_data = (data) =>
{
    return Buffer.from(data, 'utf-8').toString('base64');
}

const decode_amnezia_data = async (data) =>
{
    return await exec("python3 decoder.py " + data);
}

const encode_amnezia_data = async (data) =>
{
    const temp_file_id = uid();
    await fs.writeFile(`./temp${temp_file_id}.json`,data);
    var result = await exec("python3 decoder.py -i ./temp"+temp_file_id+".json");
    await fs.unlink(`./temp${temp_file_id}.json`);
    return result;
}

const get_next_available_ip = async () =>
{
    var interface = await get_wg0_interface();

    var ips = interface.split("\n").filter((item) => item.includes("AllowedIPs"));
    var ips_arr = ips.map((item) => item.split(" = ")[1]);
    ips_arr = ips_arr.map((item) => item.split("/")[0]);


    /*
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
    */
    
    const ip2number = (ip) => ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
    const number2ip = (num) => [num >>> 24, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join(".");

    const subnet_start = ip2number("10.8.1.2");
    const subnet_end = ip2number("10.8.255.255");

    const used_arr = new Set(ips_arr.map(ip2number));

    for (let ip = subnet_start; ip <= subnet_end; ip++) 
    {
        if(number2ip(ip).endsWith(".0") || number2ip(ip).endsWith(".255")) continue;
        
        if (!used_arr.has(ip)) 
        {
            return number2ip(ip) + "/32";
        }
    }

    throw new Error("No more available IPs");
    

}

const restart_awg_container = async () =>
{
    await exec("docker restart amnezia-awg");
    const container_id = await get_amnezia_container_id();
    await exec_on_container_sh(container_id,"iptables -A FORWARD -s 10.8.0.0/16 -j ACCEPT");
    await exec_on_container_sh(container_id,"iptables -t nat -A POSTROUTING -s 10.8.0.0/16 -o eth0 -j MASQUERADE"); 
    await exec_on_container_sh(container_id,"iptables -t nat -A POSTROUTING -s 10.8.0.0/16 -o eth1 -j MASQUERADE"); 
    await exec_on_container_sh(container_id,"iptables-save > /etc/iptables/rules.v4"); 
    console.log("AWG container restarted");
}

const backup_data = async () =>
{
    try { await fs.mkdir("./dbbu"); } catch(err) {} 
    
    const users = await User.find();
    const amnezia_client_table = await get_amnezia_clients_table();
    const amnezia_interface = await get_wg0_interface();

    await fs.writeFile("./dbbu/users.json",JSON.stringify(users,null,4));
    await fs.writeFile("./dbbu/amnezia_clients_table.json",JSON.stringify(amnezia_client_table,null,4));
    await fs.writeFile("./dbbu/amnezia_interface.conf",amnezia_interface);

    var zip = new AdmZip();
    var zip_id = Date.now();
    var final_file = "./dbbu/bu"+zip_id+".zip"
    
    zip.addLocalFile("./dbbu/users.json");
    zip.addLocalFile("./dbbu/amnezia_clients_table.json");
    zip.addLocalFile("./dbbu/amnezia_interface.conf");
    zip.addLocalFolder("/etc/nginx/sites-available","nginx");
    zip.addLocalFolder("/etc/letsencrypt/live","certs");

    zip.writeZip(final_file);

    await fs.unlink("./dbbu/users.json");
    await fs.unlink("./dbbu/amnezia_clients_table.json");
    await fs.unlink("./dbbu/amnezia_interface.conf");

    return final_file;
}

const $sync_accounting = async () =>
{
    var users = await User.find();
    var interface = await get_wg0_interface();
    var interface_lines = interface.split("\n");
    var clients_table = await get_amnezia_clients_table();

    for(let user of users)
    {


        const client_table_names = clients_table.map((item) => item.userData.clientName);

        if(!client_table_names.includes(user.username))
        {
            await Log.create({msg: `User ${user.username} not found in clients table, deleting user`});
            console.log(`User ${user.username} not found in clients table, deleting user`);
            await User.deleteOne({username: user.username});
            continue;
        }

        const client_table_user_obj = clients_table.find((item) => item.userData.clientName == user.username);

        const used_traffic = await get_user_traffic_from_wg_cli(user.public_key);

        if(used_traffic != false && used_traffic != user.last_captured_traffic)
        {
            if(used_traffic < user.used_traffic)
            {

                var incremental_value;
                if(used_traffic > user.last_captured_traffic) incremental_value = used_traffic - user.last_captured_traffic;
                else incremental_value = used_traffic;

                await User.updateOne({username: user.username}, {used_traffic: user.used_traffic + incremental_value, last_captured_traffic: used_traffic});
                user.used_traffic = user.used_traffic + incremental_value;
                console.log(`User ${user.username} used traffic updated to ${b2gb(used_traffic)} MB (increment)`);
            }

            else if(used_traffic > user.used_traffic)
            {
                await User.updateOne({username: user.username}, {used_traffic, last_captured_traffic: used_traffic});
                user.used_traffic = used_traffic;
                console.log(`User ${user.username} used traffic updated to ${b2gb(used_traffic)} MB (replace)`);
            }

        }

        /*
        if(user.used_traffic >= user.data_limit)
        {
            if(user.status == "active") 
            {
                await User.updateOne({username: user.username}, {status: "limited"});
                user.status = "limited";
                console.log(`User ${user.username} status changed to limited`);
            }
        }
        */

        if(user.expire < get_now())
        {
            if(user.status == "active") 
            {
                await User.updateOne({username: user.username}, {status: "expired"});
                user.status = "expired";
                console.log(`User ${user.username} status changed to expired`);
            }
        }

        if(user.status == "limited" && user.used_traffic < user.data_limit)
        {
            await User.updateOne({username: user.username}, {status: "active"});
            user.status = "active";
            console.log(`User ${user.username} status changed to active`);
        }

        if(user.status == "expired" && user.expire > get_now())
        {
            await User.updateOne({username: user.username}, {status: "active"});
            user.status = "active";
            console.log(`User ${user.username} status changed to active`);
        }


        // ------------------------------ //


        if(user.status != "active")
        {
            var public_key_line_index = interface_lines.findIndex((item) => item.includes(user.public_key));
            if(!interface_lines[public_key_line_index + 2].startsWith("#")) 
            {
                interface_lines[public_key_line_index - 1] = "#"+interface_lines[public_key_line_index - 1];
                interface_lines[public_key_line_index + 0] = "#"+interface_lines[public_key_line_index + 0];
                interface_lines[public_key_line_index + 1] = "#"+interface_lines[public_key_line_index + 1];
                interface_lines[public_key_line_index + 2] = "#"+interface_lines[public_key_line_index + 2];

                await replace_wg0_interface(interface_lines.join("\n"));
                await sync_configs();
                console.log(`UPDATED INTERFACE FOR ${user.username}`);
            }
        }

        else
        {
            var public_key_line_index = interface_lines.findIndex((item) => item.includes(user.public_key));
            if(interface_lines[public_key_line_index + 2].startsWith("#")) 
            {
                interface_lines[public_key_line_index - 1] = interface_lines[public_key_line_index - 1].replace("#","");
                interface_lines[public_key_line_index + 0] = interface_lines[public_key_line_index + 0].replace("#","");
                interface_lines[public_key_line_index + 1] = interface_lines[public_key_line_index + 1].replace("#","");
                interface_lines[public_key_line_index + 2] = interface_lines[public_key_line_index + 2].replace("#","");

                await replace_wg0_interface(interface_lines.join("\n"));
                await sync_configs();
                console.log(`UPDATED INTERFACE FOR ${user.username}`);
            }
        }

        // ------------------------------ //
    }
    
}

cron.schedule('0 5 * * *', () => 
{
    restart_awg_container();
}, 
{
    timezone: 'Asia/Tehran',
});

cron.schedule('0 0 * * *', () => 
{
    update_users_subscription_desc();
}, 
{
    timezone: 'Asia/Tehran',
});


const user_schema = new mongoose.Schema
({
    username: String,
    expire: Number,
    data_limit: Number,
    used_traffic: { type: Number, default: 0 },
    last_captured_traffic: { type: Number, default: 0 },
    lifetime_used_traffic: { type: Number, default: 0 },
    status: { type: String, default: "active", enum: ["active","limited","expired","disabled"] },
    created_at: { type: Number, default: get_now },
    connection_string: { type: String, default: "" },
    subscription_url: { type: String, default: "" },
    real_subscription_url: { type: String, default: "" },
    public_key: { type: String, default: "" },
    maximum_connections: { type: Number, default: 1 },
    connection_uuids: { type: Array, default: [] },
    has_been_unlocked: { type: Boolean, default: false },

},{collection: 'users',versionKey: false});

const log_schema = new mongoose.Schema
({
    msg: { type: String, required: true },
    created_at: { type: Number, default: get_now },
},{collection: 'logs',versionKey: false});

const User = mongoose.model('User', user_schema);
const Log = mongoose.model('Log', log_schema);


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
    extend_expire_times,
    backup_data,
    get_all_users_for_marzban,
    reset_user_account,
    edit_user,
    delete_user,
    sleep,
    get_real_subscription_url,
    unlock_user_account,
    restart_awg_container,
    update_users_subscription_desc,

    $sync_accounting,
}