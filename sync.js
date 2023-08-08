var accounts_clct,panels_clct,users_clct,logs_clct;

const { uid,
        uidv2,
        sleep,
        insert_to_accounts,
        get_accounts,
        get_account,
        update_account,
        insert_to_panels,
        get_panels,
        get_panel,
        update_panel,
        insert_to_users,
        get_users,
        get_all_users,
        get_user1,
        get_user2,
        update_user,
        insert_to_logs,
        get_logs,
        b2gb,
        gb2b,
        dnf,
        add_token,
        token_to_account,
        auth_marzban,
        get_panel_info,
        make_vpn,
        delete_vpn,
        disable_vpn,
        enable_vpn,
        edit_vpn,
        get_marzban_user,
        get_all_marzban_users,
        reload_agents,
        reset_marzban_user,
        ping_panel,
        connect_to_db
       } = require("./utils");


connect_to_db().then(res =>
{
    accounts_clct = res.accounts_clct;
    panels_clct = res.panels_clct;
    users_clct = res.users_clct;
    logs_clct = res. logs_clct;
});


(async () => 
{
    await sleep(5000);

    while(true)
    {
        var panels_arr = await get_panels();
        var db_users_arr = await get_all_users();
        for(panel of panels_arr)
        {
            if(panel.disable) continue;
            var today = new Date();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            console.log(time + " ---> fetching " + panel.panel_url);

            var info_obj = await get_panel_info(panel.panel_url,panel.panel_username,panel.panel_password);
            if(info_obj == "ERR")
            {
                console.log(time + " ===> failed to fetch " + panel.panel_url);
                await ping_panel(panel);
                continue;
            }
            else await update_panel(panel.id,info_obj);

            var marzban_users = await get_all_marzban_users(panel.panel_url,panel.panel_username,panel.panel_password);
            if(marzban_users == "ERR") 
            {
                console.log(time + " ===> failed to fetch " + panel.panel_url);
                continue;
            }

            marzban_users = marzban_users.users;

            for(db_user of db_users_arr)
            {
                var user = marzban_users.find(user => user.username == db_user.username);
                if(!user && db_user.corresponding_panel == panel.panel_url)
                {
                    console.log("user " + db_user.username + " not found in " + panel.panel_url + " deleting...");
                    var user_obj = await get_user2(db_user.username);
                    var agent_obj = await get_account(user_obj.agent_id);
                    await update_account(agent_obj.id,{allocatable_data:dnf(agent_obj.allocatable_data + b2gb(user_obj.data_limit - user_obj.used_traffic))});
                    await users_clct.deleteOne({username:db_user.username});
                }
            }

            for(marzban_user of marzban_users)
            {
                var user = db_users_arr.find(user => user.username == marzban_user.username);
                
                if(user)
                {
                    if(user.status == "active" && marzban_user.status == "disabled") await update_user(user.id,{status:"disable",disable:1});
                    else if(user.status == "disable" && marzban_user.status == "active") await update_user(user.id,{status:"active",disable:0});

                    if(user.expire != marzban_user.expire) await update_user(user.id,{expire:marzban_user.expire});
                    if(user.data_limit != marzban_user.data_limit) await update_user(user.id,{data_limit:marzban_user.data_limit});
                    if(user.used_traffic != marzban_user.used_traffic) 
                    {
                        var agent = await get_account(user.agent_id);
                        agent.volume -= marzban_user.used_traffic - user.used_traffic;
                        await update_account(agent.id,{volume:agent.volume});
                        await update_user(user.id,{used_traffic:marzban_user.used_traffic});

                    }
                }
            }
        }


        await sleep(20000);
    }
})();