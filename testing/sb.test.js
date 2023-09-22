const axios = require('axios');
const fs = require('fs');
const util = require('util');
const {get_marzban_user,get_panel_info,restart_marzban_xray} = require("../utils");
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

// async function dl_file(url,destination) 
// {
// 	const response = await axios
// 	({
// 	  url,
// 	  method: 'POST',
// 	  responseType: 'stream',
//       data: {api_key: "resllmwriewfeujeh3i3ifdkmwheweljedifefhyr"}
// 	});
  
		
// 	const writer = fs.createWriteStream(destination);
  
// 	response.data.pipe(writer);
  
// 	return new Promise((resolve, reject) => 
// 	{
// 	  writer.on('finish', resolve);
// 	  writer.on('error', reject);
// 	});
// }

// (async () => 
// {
//     const response = await axios({
//         url:"http://16.16.61.238:7002/edit_expire_times",
//         method: 'POST',
//         data: {api_key:"resllmwriewfeujeh3i3ifdkmwheweljedifefhyr",added_time:100001}
//       });

//       console.log(response.data);
// })();


// (async () => 
// {
//     const response = await axios({
//         url:"http://16.16.61.238:7002/get_marzban_users",
//         method: 'POST',
//         data: {api_key:"resllmwriewfeujeh3i3ifdkmwheweljedifefhyr",users:["Ramin_25"]}
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




//  dl_file("http://ir1.mf1vpn.xyz:7002/dldb","db.zip");