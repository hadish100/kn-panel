const axios = require('axios');
const fs = require('fs');
// const util = require('util');
// const {
//   get_marzban_user,
//   get_agents,
//   get_agents_daily_usage_logs,
//   get_panel_info,
//   restart_marzban_xray,
//   auth_marzban,
//   get_user_data_graph,
//   get_agent_data_graph,
//   syslog,
//   sleep,
//   get_accounts
// } = require("../utils");
// const moment = require('moment-timezone');


// var now2 = Math.floor((new Date()).setHours(0,0,0,0).getTime()/1000);
// var now3 = Math.floor(moment.tz("Asia/Tehran").set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).clone().utc().unix());
// console.log(now2);
// console.log(now3);

// (async () => 
// {
// 	await new Promise(resolve => setTimeout(resolve, 1000));	
// 	var result1 = await get_agents();
// 	var result2 = await get_agents_daily_usage_logs();
// 	console.log(result1);
// 	console.log(result2);
// })();

// var currentDate = new Date();
// currentDate.setHours(0, 0, 0, 0);
// var timestamp = currentDate.getTime();
// var timestampInSeconds = Math.floor(timestamp / 1000);
// console.log(timestampInSeconds);





// const utcTime = moment.utc();
// utcTime.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
// const timestamp3 = utcTime.unix();
// console.log(timestamp3);

// (async () => 
// {
//     var link = "https://panel.gostar.tech:8880";
//     var username = "admin";
//     var password = "mahdi2020";

//     var test = await get_panel_info(link, username, password);
//     console.log(test);
// })();

// (async () => 
// {
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     var result = await get_agent_data_graph(1673636041,1698919269,1);
//     console.log(result.total_allocated_data.filter(x=>x.count>0));
// })();


// (async () => 
// {
// 	await sleep(2000)
// 	await syslog("TESTING SYSTEM LOG",1);
// 	console.log("DONE!");

// })();

// (async () => {
//   var complete_user_info = get_marzban_user("http://206.189.58.110:8000", "admin", "admin", "Smart_baqer");
//   console.log(complete_user_info);
// })();

// (async () => {
//     var result = await restart_marzban_xray("https://sv.limoovp5.sbs:8000","armanmprr","Shadow2014@");
//     console.log(result);
// })();

// for(var i=0;i<50;i++)
// {
//   console.log(i);
//   get_marzban_user("http://206.189.58.110:8000", "admin", "admin", "Smart_baqer").then((complete_user_info) => {
//     console.log(complete_user_info.expire);
//   });
// }


// (async () => 
// {
//     var result = await axios.get("https://ir1.mf1vpn.xyz:8880/sub/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhcGlfdGVzdCIsImFjY2VzcyI6InN1YnNjcmlwdGlvbiIsImlhdCI6MTY5NDY4MDk2MX0.muugIkPh3cOMtoaZlglIkZ1JTBxQY4oUzTUBJ5_55wE")
//     console.log(result);
// })();

// const dl_file = async (url,destination) =>
// {
//     try
//     {
//         const response = await axios
//         ({
//           url,
//           method: 'POST',
//           responseType: 'stream',
//           data: {api_key: "resllmwriewfeujeh3i3ifdkmwheweljedifefhyr"},
//           timeout:15000
//         });
      
            
//         const writer = fs.createWriteStream(destination);
      
//         response.data.pipe(writer);
      
//         return new Promise((resolve, reject) => 
//         {
//           writer.on('finish', resolve);
//           writer.on('error', reject);
//           response.data.on('error', reject);
//         });
//     }

//     catch(err)
//     {
//         throw new Error(`DL ERROR : ${err.message}`);
//     }

// }

// (async () => 
// {
//     const response = await axios({
//         url:"http://91.107.254.15:7002/delete_users",
//         method: 'POST',
//         data: {api_key:"resllmwriewfeujeh3i3ifdkmwheweljedifefhyr",users:["ST_test6060"]}
//       });

//       console.log(response.data);
// })();


// (async () => 
// {
//     const response = await axios({
//         url:"http://nic.iranstratus.top:7002/get_marzban_users",
//         method: 'POST',
//         data: {api_key:"resllmwriewfeujeh3i3ifdkmwheweljedifefhyr"}
//       });

//       console.log(response.data);
// })();


// (async () => 
// {
//     const response = await axios({
//         url:"http://16.16.61.238:7002/delete_users",
//         method: 'POST',
//         data: {api_key:"resllmwriewfeujeh3i3ifdkmwheweljedifefhyr",users:["royal66","pasrgad5087"]}
//       });
//       console.log(response.data);
//       await fs.promises.writeFile("temp.txt",JSON.stringify(response.data.deleted_users));

//       console.log("DONE");
// })();

// (async () => 
// {

//     var users = await fs.promises.readFile("temp.txt","utf8");

//     const response = await axios({
//         url:"http://16.16.61.238:7002/add_users",
//         method: 'POST',
//         data: {api_key:"resllmwriewfeujeh3i3ifdkmwheweljedifefhyr",deleted_users:JSON.parse(users),available_protocols:["vless","trojan"]}
//       });

//       console.log(response.data);
//       console.log("DONE");

//     // var inf = await get_panel_info("http://sv.limoovp1.sbs:8000","armanmprr","Shadow2014@");
//     // console.log(inf);
// })();


// (async () => 
// {
//     // await axios.post("http://localhost:5000/add_sub_account",{access_token:"r6kXzmufeie1FnzD6Vrmt7nclX42kM",username:'admin12',password:'123'});
//     var res = await axios.post("http://localhost:5000/disable_all_agent_users",{access_token:"w1kh4mODGcc32EblLyO5roOQ3fOFiT*",agent_id:890053885});
//     console.log(res.data);
// })();



// dl_file("http://p.limoovp1.sbs:7002/dldb","db.zip");

/*
db.users.updateMany({'country': 'Amnezia_Poland1'},{$set:{'country': 'Amnezia_Netherland1'}})
db.panels.updateMany({'panel_country': 'Amnezia_Poland1'},{$set:{'panel_country': 'Amnezia_Netherland1'}})
db.accounts.updateMany({'is_admin': 0},{$set:{'country': 'Amnezia_Netherland1,Amnezia_Turkey1'}})
*/

async function main()
{
    const admins = [
      {"username":"amir"},
      {"username":"Amirfillter"},
      {"username":"Atila_VPN"},
      {"username":"Belto"},
      {"username":"bytes_war"},
      {"username":"caffenet"},
      {"username":"caw.vpn"},
      {"username":"Danger"},
      {"username":"Dehkordphone"},
      {"username":"Diamond"},
      {"username":"Famous_vpn"},
      {"username":"Fly2world"},
      {"username":"Gateless"},
      {"username":"Heydari"},
      {"username":"Heyphone"},
      {"username":"hvna"},
      {"username":"HydroPing"},
      {"username":"HydroPing_De"},
      {"username":"Ice_VPN"},
      {"username":"Mardin_vpn"},
      {"username":"Max_Shop"},
      {"username":"Mobile_Tavana"},
      {"username":"MobiTech"},
      {"username":"MoboFix"},
      {"username":"Msh_VPN"},
      {"username":"Netoray"},
      {"username":"Nily"},
      {"username":"NK_Shop"},
      {"username":"omidvpn"},
      {"username":"oxping"},
      {"username":"Panda"},
      {"username":"pv99"},
      {"username":"Sarve"},
      {"username":"Seven_VPN"},
      {"username":"Shahr_Mobile"},
      {"username":"SivHD"},
      {"username":"Storm"},
      {"username":"Tarazgaranvpn_bot"},
      {"username":"Toori"},
      {"username":"Undomobile"},
      {"username":"V2_TRUST"},
      {"username":"verifybitt"},
      {"username":"Zodiac"}
      ]


      for(let admin of admins)
      {
        await axios.post('http://91.107.176.173:5000/create_agent',
        {"name":admin.username,
        "username":admin.username,
        "password":"1234567",
        "volume":"100",
        "min_vol":"5",
        "max_users":"100",
        "max_days":"30",
        "prefix":admin.username,
        "country":"main1",
        "access_token":"uF6Wdz7VqAn8mKou2ANfduNr2NVmTX*",
        "max_non_active_days":"90",
        "business_mode":0,
        "vrate":"5000"})

        console.log(`Created agent for ${admin.username}`);
      }

}

main()

/*
sqlite3 db.sqlite3 ".dump" > dump.sql
sqlite3 new.db < dump.sql
*/

/*

docker exec -i mongo-knp mongosh --quiet --eval "
db.getSiblingDB('KN_PANEL').accounts.updateOne(
  { 'sub_accounts.username': 'hadi' },
  {
    \$set: {
      'sub_accounts.\$[elem].agent_whitelist': ['amirhoseynp','rezvani']
    }
  },
  {
    arrayFilters: [
      { 'elem.username': 'hadi' }
    ]
  }
)"

*/

