const app = require('express')();
const axios = require('axios');

// const auth = 
// {
//     'username' : 'admin',
//     'password' : 'admin123456'
// };



// (async () => 
// {
//     var api_auth_res = (await axios.post('http://164.92.143.109/api/login/',auth,{headers:{'accept': 'application/json','Content-Type': 'application/json'}})).data;
//     access_token = 'Bearer ' + api_auth_res.access;

//     var create_agent = (await axios.post('http://164.92.143.109/admin/agent/create',
//     {
//         agent_name:"test512",
//         volume:1000,
//         maximum_day:30,
//         country:"NL",
//         prefix:"GAN",
//         username:"aaaa",
//         password:"bbbb",
//         //panels:[],
//         maximum_user:30
//     },
//     {headers:{accept:'application/json',Authorization:access_token}})).data;


//     var create_panel = (await axios.post('http://164.92.143.109/api/admin/panel/create/',
//     {
//         panel_name:"test",
//         panel_url:"https://v1.mf1vpn.xyz",
//         panel_username:"mf1",
//         panel_password:"1057",
//         panel_country:"NL",
//         panel_user_max_count:1000,
//         panel_user_max_date:2000000000,
//         panel_traffic:1000000,
//     },
//     {headers:{accept:'application/json',Authorization:access_token}}));


//     var create_user = (await axios.post('http://164.92.143.109/api/user/create/',
//     {
//         username:"test1000",
//         expire:2000000000,
//         limit:50
//     },
//     {headers:{accept:'application/json',Authorization:access_token}}));

//     var agents = (await axios.get('http://164.92.143.109/api/admin/agents/',{headers:{accept:'application/json',Authorization:access_token}})).data
//     var panels = (await axios.get('http://164.92.143.109/api/admin/panel/view/',{headers:{accept:'application/json',Authorization:access_token}})).data
//     var users = (await axios.get('http://164.92.143.109/api/user/view/',{headers:{accept:'application/json',Authorization:access_token}})).data

// })();


// app.get("/test", async (req, res) => 
// {
// });

app.listen(5000, () => 
{
    console.log("--------------");
    console.log("SERVER STARTED !");
    console.log("--------------");
})

