var accounts_clct, panels_clct, users_clct, logs_clct;

const {
    connect_to_db,
    get_panels,
    get_all_marzban_users,
    auth_marzban,
    get_panel_info,
    get_accounts,
    get_all_users
} = require("../utils");


connect_to_db().then(res => {
    accounts_clct = res.accounts_clct;
    panels_clct = res.panels_clct;
    users_clct = res.users_clct;
    logs_clct = res.logs_clct;
    init();
});

async function init()
{
    var panels_arr = await get_panels();
    for(panel of panels_arr)
    {
        var marzban_users_arr = (await get_all_marzban_users(panel.panel_url, panel.panel_username, panel.panel_password));
        if(marzban_users_arr == "ERR") {console.log("skipped");continue;}
        marzban_users_arr = marzban_users_arr.users
        var db_users_arr = await users_clct.find({corresponding_panel_id: panel.id}).toArray(); 
        for(user of db_users_arr)
        {
            var marzban_user_obj = marzban_users_arr.find(marzban_user => marzban_user.username == user.username);
            if(marzban_user_obj) await users_clct.updateOne({username: user.username}, {$set: {created_at: Math.floor(Date.parse(marzban_user_obj.created_at)/1000)}});
        }

        console.log("DONE 1 !!!");
    }



    console.log("DONE 2 !!!");
}