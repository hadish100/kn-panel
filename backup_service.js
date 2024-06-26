const { Telegraf } = require('telegraf');
const nodemailer = require('nodemailer');
const fs = require('fs');
const axios = require('axios');
const sleep = (s) => new Promise(resolve => setTimeout(resolve,s*1000));
require('dotenv').config()

async function init() 
{
    var config_obj = JSON.parse(await fs.promises.readFile("./backup_config.json", "utf8"));
    setTimeout(function(){ process.exit(1); },config_obj.interval*1000);
    const bot = new Telegraf(config_obj.telegram.bot_token);
    if(!config_obj.telegram.disabled) bot.launch();
    const chat_id = config_obj.telegram.chat_id;

    const transporter = nodemailer.createTransport(config_obj.email.sender);           

        try 
        {
          console.log("*STARTING BACKUP SERVICE");

          var dbdl_files = await fs.promises.readdir("./frontend/public/dbdl");

          for(var i=0;i<dbdl_files.length;i++)
          {
            if(!dbdl_files[i].endsWith(".zip")) continue;
            var file_path = "./frontend/public/dbdl/" + dbdl_files[i];
            var file_stat = await fs.promises.stat(file_path);
            var diff = new Date() - new Date(file_stat.mtime);
            if(diff > 2*60*60*24*1000) await fs.promises.unlink(file_path);
          }


          var res = (await axios.post("http://localhost:" + process.env.SERVER_PORT + "/dldb", { service_access_api_key : "resllmwriewfeujeh3i3ifdkmwheweljedifefhyr" })).data;
          var filePath = "./frontend/public" + res.split(">")[1];
          var today = new Date();
          var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

          const mailOptions = 
          {
            from: config_obj.email.sender.auth.user,
            to: config_obj.email.receiver,
            subject: res.split("/dbdl/")[1].replace(".zip", ""),
            text: '',
            attachments: 
            [
              {
                filename: 'db.zip',
                path: filePath
              }
            ]
          };

          // SEND IN TELEGRAM
          if(!config_obj.telegram.disabled)
          {
            var res1 = await bot.telegram.sendDocument(chat_id, { source: filePath });
            console.log(time + " ---> Backup Sent to telegram");
          }

          // SEND IN EMAIL
          if(!config_obj.email.disabled)
          {
            var res2 = await transporter.sendMail(mailOptions);
            console.log(time + " ---> Backup Sent to email");
          }

          await fs.promises.unlink(filePath);
        }
         catch (err) 
        {
          console.log(err);
        }

        await sleep(config_obj.interval);
}

init();

