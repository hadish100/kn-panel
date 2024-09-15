const {get_marzban_user,get_all_users,get_panels} = require("../utils");

var { users_clct } = require('./db_interface');

async function init()
{
    var db_users = await get_all_users();
    // db_users = db_users.filter(u=>u.real_subscription_url.includes("undefined"));
    console.log(`found ${db_users.length} users`);

    var panels = await get_panels();

    for(panel of panels)
    {
        var panel_users = db_users.filter(u=>u.corresponding_panel_id == panel.id);

        for(user of panel_users)
        {
            // var marzban_user = await get_marzban_user(panel.panel_url, panel.panel_username, panel.panel_password, user.username);

            // if(marzban_user)
            // {
            //     await users_clct.updateOne({id:user.id},{$set:{links:marzban_user.links}});
            //     console.log(`user ${user.id} updated`);
            // }

            // replace https://cdx.irtunir.com:9000 with https://cdx.irtunir.com in every user
            await users_clct.updateOne({id:user.id},{$set:{subscription_url:user.subscription_url.replace("https://cdx.irtunir.com:9000","https://cdx.irtunir.com")}});
            console.log("old url: " + user.subscription_url);
            console.log("new url: " + user.subscription_url.replace("https://cdx.irtunir.com:9000","https://cdx.irtunir.com"));
            console.log("====================================");
            // console.log(panel.panel_url.replace(/http(?![s])/,"https") + "/sub/" + user.real_subscription_url.split("/sub/")[1]);
        }
    }

    console.log("done");
}

init();