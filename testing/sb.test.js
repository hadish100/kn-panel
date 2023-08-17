const axios = require('axios');
const fs = require('fs');

async function dl_file(url,destination) 
{
	const response = await axios({
	  url,
	  method: 'POST',
	  responseType: 'stream',
      data: {api_key: "resllmwriewfeujeh3i3ifdkmwheweljedifefhyr"}
	});
  
		
	const writer = fs.createWriteStream(destination);
  
	response.data.pipe(writer);
  
	return new Promise((resolve, reject) => {
	  writer.on('finish', resolve);
	  writer.on('error', reject);
	});
}

(async () => 
{
    const response = await axios({
        url:"http://159.223.18.18:7002/edit_expire_times",
        method: 'POST',
        responseType: 'stream',
        data: {api_key:"resllmwriewfeujeh3i3ifdkmwheweljedifefhyr",added_time:300000}
      });

      console.log(response.data);
})();

// dl_file("http://159.223.18.18:7002/dldb","db.sqlite3");