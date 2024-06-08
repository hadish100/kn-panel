const {get_marzban_user,get_all_users,connect_to_db,get_panels} = require("../utils");

connect_to_db().then(res => {
    accounts_clct = res.accounts_clct;
    panels_clct = res.panels_clct;
    users_clct = res.users_clct;
    logs_clct = res.logs_clct;
    init();
});

async function init()
{
    var db_users = await get_all_users();
    // db_users = db_users.filter(u=>u.real_subscription_url.includes("undefined"));
    console.log(`found ${db_users.length} users with undefined sub link`);

    var panels = await get_panels();

    for(panel of panels)
    {
        var panel_users = db_users.filter(u=>u.corresponding_panel_id == panel.id);

        for(user of panel_users)
        {
            var marzban_user = await get_marzban_user(panel.panel_url, panel.panel_username, panel.panel_password, user.username);
            if(marzban_user)
            {
                var sub_link = marzban_user.subscription_url;
                await users_clct.updateOne({id:user.id},{$set:{real_subscription_url:sub_link}});
                console.log(`user ${user.id} updated`);
            }

            console.log(panel.panel_url.replace(/http(?![s])/,"https") + "/sub/" + user.real_subscription_url.split("/sub/")[1]);
        }
    }

    console.log("done");
}

