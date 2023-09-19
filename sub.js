const fs = require('fs');
const https = require('https');
const express = require('express');
var app = express();
require('dotenv').config();
var users_clct;
const { connect_to_db } = require("./utils");

connect_to_db().then(res => { users_clct = res.users_clct;});

var options = {key: fs.readFileSync(process.env.PVKEY),cert: fs.readFileSync(process.env.PVKEY)};


var server = https.createServer(options,app).listen(parseInt(process.env.SUB_PORT),function()
{
  console.log("===> SUB SERVER LISTENING ON PORT : " + process.env.SUB_PORT);
});

app.get(/^\/sub\/.+/,async (req,res) =>
{
    var sub_id = req.url.split("/")[2];
    var user_obj = await users_clct.find({subscription_url:{$regex:sub_id}}).toArray();
    if(user_obj.length == 0) res.send("NOT FOUND");
    else
    {
        res.redirect(user_obj[0].real_subscription_url);
    }
});