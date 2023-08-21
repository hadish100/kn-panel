const { Telegraf } = require('telegraf');
const fs = require('fs');
const axios = require('axios');
const bot = new Telegraf('6598703756:AAHdCGAnBJYJ3-UKN76HKWFmF7XiqLfexas');bot.launch();
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const channelLink = "@asdar3refdsfdghyeffwwadf4fdgjkts";

async function bu() 
{
    while(true)
    {
        try 
        {
          var res = (await axios.post("http://localhost:5000/dldb", { service_access_api_key : "resllmwriewfeujeh3i3ifdkmwheweljedifefhyr" })).data;
          var filePath = "./frontend/public" + res.split(">")[1];
          await bot.telegram.sendDocument(channelLink, { source: filePath });
          await fs.promises.unlink(filePath);
        }
         catch (err) 
        {
          console.log(err);
        }

        await sleep(1800000);
    }
}

setTimeout(function(){bu();},2000);

