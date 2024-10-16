const {get_marzban_user,get_all_users,get_panels} = require("../utils");

var { users_clct } = require('../db_interface');

async function init()
{
    var db_users = await get_all_users();
    db_users = db_users.filter(u=>u.real_subscription_url.includes("undefined"));
    console.log(`found ${db_users.length} users`);

    var panels = await get_panels();

    for(let panel of panels)
    {
        var panel_users = db_users.filter(u=>u.corresponding_panel_id == panel.id);

        for(let user of panel_users)
        {
            var marzban_user = await get_marzban_user(panel.panel_url, panel.panel_username, panel.panel_password, user.username);
            console.log(marzban_user.subscription_url);

            if(marzban_user)
            {
                // await (await users_clct()).updateOne({id:user.id},{$set:{links:marzban_user.links}});
                console.log(`user ${user.id} updated`);
            }
        }
    }

    console.log("done");
}

init();