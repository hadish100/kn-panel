require("dotenv").config();
// const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/knaw');
const axios = require('axios');
const fs = require('fs').promises;
const JWT_SECRET_KEY = "resllmwriewfeujeh3i3ifdkmwheweljedifefhyr";
const jwt = require('jsonwebtoken');
const SERVER_ADDRESS = process.env.SERVER_ADDRESS;
const SESSION_ID = 
{
    value: "",
    last_updated: 0,
};


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

const auth_wg = async () =>
{
    if(get_now() - SESSION_ID.last_updated > 60*60*3)
    {
        var password = process.env.SERVER_PASSWORD;
        var auth_obj = {password:"wg"};
        if(password) auth_obj.password = password;
        var headers = {'Content-Type': 'application/json'};
        var response = await axios.post(`${SERVER_ADDRESS}/api/session`,auth_obj,headers,{timeout:10000});
        var cookie = response.headers['set-cookie'][0];
        SESSION_ID.value = cookie.split(';')[0];
        SESSION_ID.last_updated = get_now();
    }

    return {
        "Content-Type": "application/json",
        "Cookie": SESSION_ID.value,
    }
}

const get_wireguard_clients = async () =>
{
    var headers = await auth_wg();
    var response = await axios.get(`${SERVER_ADDRESS}/api/wireguard/client`,{headers},{timeout:10000});
    var response_arr = response.data;
    return response_arr;
}

const get_clients_for_marzban = async () =>
{
    var response_arr = await get_wireguard_clients();
    response_arr = response_arr.map((item) =>
    ({
        id: item.id,
        name: item.name,
        enabled: item.enabled,
        address: item.address,
        created_at: Math.floor(new Date(item.createdAt).getTime() / 1000),
        used_traffic: b2gb(item.transferRx + item.transferTx),
    }));

    return response_arr;
}

const get_system_status = async () =>
{
    var response_arr = await get_wireguard_clients();
    var result =
    {
        total_user:response_arr.length,
        users_active:response_arr.filter((item) => item.enabled).length,
        incoming_bandwidth: 10937477817,
        outgoing_bandwidth: 5568768696,
    }

    return result;
}

const get_user_id_from_username = async (username) =>
{
    var clients = await get_wireguard_clients();
    var client = clients.find((item) => item.name == username);
    return client.id;
}

const create_user = async (username, expire, data_limit) =>
{
    var headers = await auth_wg();
    await axios.post(`${SERVER_ADDRESS}/api/wireguard/client`,{name:username},{headers},{timeout:10000});

    var result =
    {
        "links": ["WG","WG","WG","WG"],
        "subscription_url": (await get_user_for_marzban(username)).subscription_url,
    }

    return result;

}

const get_user_for_marzban = async (username) =>
{
    var user_id = await get_user_id_from_username(username);
    var headers = await auth_wg();
    var response = await axios.get(`${SERVER_ADDRESS}/api/wireguard/client/${user_id}/configuration`,{headers},{timeout:10000});
    var config = response.data;
    const result =
    {
        proxies: {
            "trojan": {
              "password": "WG",
              "flow": ""
            },
            "vless": {
              "id": "WG",
              "flow": ""
            },
            "vmess": {
              "id": "WG"
            },
            "shadowsocks": {
              "password": "WG",
              "method": "WG"
            }
          },

          links: ["WG","WG","WG","WG"],
          lifetime_used_traffic: 0,
          subscription_url: config,
    }

    return result;
}

const disable_client = async (id) =>
{
    var headers = await auth_wg();
    var response = await axios.post(`${SERVER_ADDRESS}/api/wireguard/client/${id}/disable`,{},{headers},{timeout:10000});
    return true;
}

const enable_client = async (id) =>
{
    var headers = await auth_wg();
    var response = await axios.post(`${SERVER_ADDRESS}/api/wireguard/client/${id}/enable`,{},{headers},{timeout:10000});
    return true;
}

/*
const sync__and__process = async () =>
{
    var users = await get_clients();

    for(let user of users)
    {
        var username = user.name;

        console.log("Processing user " + username)

        if(username.split('__').length != 3) 
        {
            console.log("User " + username + " has no limits >>> skipping...");
            console.log("---------------------------")
            continue;
        }

        var data_limit = parseFloat(username.split('__')[1]);
        var expire = parseFloat(username.split('__')[2]);

        
        if(user.used_traffic > data_limit)
        {
            var disable_res = await disable_client(user.id);
            if(disable_res == "ERR") 
            {
                console.log("Error in disabling user " + username);
                console.log("---------------------------")
                continue;
            }

            await dblog(`User ${username} disabled because of traffic limit`);
        }

        else
        {
            console.log("User " + username + " hasn't reached traffic limit");
        }

        if(get_days_passed(user.created_at) > expire )
        {
            var disable_res = await disable_client(user.id);
            if(disable_res == "ERR")
            {
                console.log("Error in disabling user " + username);
                console.log("---------------------------")
                continue;
            }

            await dblog(`User ${username} disabled because of expire date`);
        }

        else
        {
            console.log("User " + username + " hasn't reached expire time");
        }

        console.log("---------------------------")
    }
}
*/

module.exports = 
{
    uid,
    generate_token,
    b2gb,
    get_now,
    validate_token,
    get_days_passed,
    auth_wg,
    get_clients_for_marzban,
    disable_client,
    enable_client,
    get_system_status,
    create_user,
    get_user_for_marzban,
}