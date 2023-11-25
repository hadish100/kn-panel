const {connect_to_db,get_all_users, update_user,get_sub_url,uidv2,proxy_obj_maker,get_panel,get_accounts} = require("../utils");
const fs = require('fs').promises;

connect_to_db().then(res => {
    accounts_clct = res.accounts_clct;
    panels_clct = res.panels_clct;
    users_clct = res.users_clct;
    logs_clct = res.logs_clct;
    modify_db();
});


async function modify_db()
{
    // var users_arr = await users_clct.find({ subscription_url: { $regex: "https://de.keskinnetwork.comhttps://de.keskinnetwork.com" } }).toArray();
    
    // for(user of users_arr)
    // {
    //     await users_clct.updateOne({username:user.username}, {$set: {subscription_url:user.subscription_url.replace("https://de.keskinnetwork.com","")}});
    //     console.log("UPDATED USER => " + user.username);
    // }
    // // await users_clct.updateMany({},{$set: {disable_counter:{value:0,last_update:Math.floor(Date.now()/1000)}}});
    // // await accounts_clct.updateMany({is_admin:0},{$set: {business_mode:0}});
    // // await accounts_clct.updateMany({is_admin:0},{$set: {max_non_active_days:15}});
    // console.log("DONE !!!");

    var users_arr = await get_all_users();
    // await accounts_clct.updateMany({is_admin:0},{$set: {lifetime_volume:0}})
    for(user of users_arr)
    {
        // await update_user(user.id, {real_subscription_url:user.subscription_url,subscription_url:get_sub_url() + "/sub/" + uidv2(10)});
        // console.log("UPDATED SUBLINK OF => " + user.username);
        // if(!user.inbounds)
        // {
        //     var corresponding_panel = await get_panel(user.corresponding_panel_id);
        //     var inbounds = proxy_obj_maker(Object.keys(corresponding_panel.panel_inbounds),"none",2);
        //     await update_user(user.id, {inbounds});
        //     console.log("UPDATED INBOUNDS OF => " + user.username);
        // }
        await update_user(user.id, {real_subscription_url:user.real_subscription_url.replace("p.limoo","panel.limoo")});
        console.log("DONE2");
        //await update_user(user.id, {lifetime_used_traffic:user.used_traffic});
        // if(user.country=="server61")
        // {
        //     await update_user(user.id,{country:"server6"});
        //     console.log("DONE 1");
        // }

        // if(user.country=="jet1")
        // {
        //     await update_user(user.id,{country:"server8"});
        //     console.log("DONE 1");
        // }

    // }

    // var accounts = await get_accounts()
    // for(account of accounts)
    // {
    //     if(!account.is_admin) await accounts_clct.updateOne({id:account.id}, {$set: {daily_usage_logs:[]}});
    //     console.log("DONE 1");
    }

    // console.log("DONE 3");

    //db.panels.updateOne({panel_country:"jet1"},{$set:{panel_country:"server8"}})
    //db.accounts.updateMany({is_admin:0},{$set:{country:"server1,server2,server3,server4,server5,server6,server7,server8"}})


    

    // var syslog_txt = await fs.readFile("../frontend/public/syslog/syslog.txt",{encoding:"utf-8"});
    // var syslog_arr = syslog_txt.split("\n");
    // var syslog_db_arr = syslog_arr.map(x =>
    // {
    //     var result = {};

    //     var dateTimeString = x.split(" ===> ")[0];

    //     if(!dateTimeString) return null;
    //     var parts = dateTimeString.split(" - ");
    //     var datePart = parts[0];
    //     var timePart = parts[1];
        
    //     var dateParts = datePart.split("/");
    //     var month = parseInt(dateParts[0]) - 1;
    //     var day = parseInt(dateParts[1]);
    //     var year = parseInt(dateParts[2]);
        
    //     var timeParts = timePart.split(":");
    //     var hours = parseInt(timeParts[0]);
    //     var minutes = parseInt(timeParts[1]);
    //     var seconds = parseInt(timeParts[2]);
    //     var timestamp = new Date(year, month, day, hours, minutes, seconds).getTime();

    //     result.msg = x.split(" ===> ")[1];
    //     result.time = Math.floor(timestamp/1000);
    //     result.is_syslog = 1;
    //     console.log("DONE 2");
    //     return result;  
    // }).filter(Boolean);



    // await logs_clct.insertMany(syslog_db_arr);
    console.log("DONE 3");

    // await fs.rm("../frontend/public/syslog", { recursive: true, force: true });

}