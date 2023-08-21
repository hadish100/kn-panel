const { Telegraf } = require('telegraf');
const nodemailer = require('nodemailer');
const fs = require('fs');
const axios = require('axios');
const bot = new Telegraf('6598703756:AAHdCGAnBJYJ3-UKN76HKWFmF7XiqLfexas');bot.launch();
const channelLink = "@asdar3refdsfdghyeffwwadf4fdgjkts";
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


async function bu() 
{
    while(true)
    {
        try 
        {
          var res = (await axios.post("http://localhost:5000/dldb", { service_access_api_key : "resllmwriewfeujeh3i3ifdkmwheweljedifefhyr" })).data;
          var filePath = "./frontend/public" + res.split(">")[1];

          // SEND IN TELEGRAM
          await bot.telegram.sendDocument(channelLink, { source: filePath });
          var today = new Date();
          var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          console.log(time + " ---> backup Sent to telegram");
          // SEND IN EMAIL

          const transporter = nodemailer.createTransport
          ({
            service: 'Gmail', 
            auth: 
            {
              user: 'your_email@example.com', 
              pass: 'your_email_password'
            }
          });

          const mailOptions = 
          {
            from: 'your_email@example.com',
            to: 'recipient@example.com',
            subject: res.split("/dbdl/")[1],
            text: '',
            attachments: 
            [
              {
                filename: 'db.zip',
                path: "./frontend/public" + res.split(">")[1]
              }
            ]
          };
          
          await transporter.sendMail(mailOptions);
          console.log(time + " ---> backup Sent to email");

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

