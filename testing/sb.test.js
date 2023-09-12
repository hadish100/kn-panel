const axios = require('axios');
const fs = require('fs');
const {get_marzban_user} = require("../utils");

(async () => {
  var complete_user_info = await get_marzban_user("http://209.38.245.93:8000", "admin", "admin", "EW_223232tggff");
  console.log(Object.keys(complete_user_info.proxies));
})();



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
//         url:"http://209.38.245.93:7002/edit_expire_times",
//         method: 'POST',
//         data: {api_key:"resllmwriewfeujeh3i3ifdkmwheweljedifefhyr",added_time:100000}
//       });

//       console.log(response.data);
// })();


// (async () => 
// {
//     const response = await axios({
//         url:"http://ir1.mf1vpn.xyz:7002/get_marzban_users",
//         method: 'POST',
//         data: {api_key:"resllmwriewfeujeh3i3ifdkmwheweljedifefhyr"}
//       });

//       console.log(response.data);
// })();




//  dl_file("http://ir1.mf1vpn.xyz:7002/dldb","db.zip");