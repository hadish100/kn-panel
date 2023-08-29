const {connect_to_db} = require("../utils");


connect_to_db().then(res => {
    accounts_clct = res.accounts_clct;
    panels_clct = res.panels_clct;
    users_clct = res.users_clct;
    logs_clct = res.logs_clct;
    modify_db();
});


async function modify_db()
{
    var users_arr = await users_clct.find({ subscription_url: { $regex: "https://de.keskinnetwork.comhttps://de.keskinnetwork.com" } }).toArray();
    
    for(user of users_arr)
    {
        await users_clct.updateOne({username:user.username}, {$set: {subscription_url:user.subscription_url.replace("https://de.keskinnetwork.com","")}});
        console.log("UPDATED USER => " + user.username);
    }
    // await users_clct.updateMany({},{$set: {disable_counter:{value:0,last_update:Math.floor(Date.now()/1000)}}});
    // await accounts_clct.updateMany({is_admin:0},{$set: {business_mode:0}});
    // await accounts_clct.updateMany({is_admin:0},{$set: {max_non_active_days:15}});
    console.log("DONE !!!");
}