var accounts_clct, panels_clct, users_clct, logs_clct;

const {
    connect_to_db,
    get_all_users,
    get_account,
    get_panel,
    sleep
} = require("../utils");


connect_to_db().then(res => {
    accounts_clct = res.accounts_clct;
    panels_clct = res.panels_clct;
    users_clct = res.users_clct;
    logs_clct = res.logs_clct;
});


(async () => {
    await sleep(5000);

    var all_users = await get_all_users();
    for(user of all_users)
    {
        var panel = await get_panel(user.corresponding_panel_id);
        var agent = await get_account(user.agent_id);

        if(!panel)
        {
            console.log("panel not found for user " + user.username + " deleting...");
            await users_clct.deleteOne({username: user.username});
        }

        if(!agent)
        {
            console.log("agent not found for user " + user.username + " deleting...");
            await users_clct.deleteOne({username: user.username});
        }
    }

    console.log("DONE !!!");


})();