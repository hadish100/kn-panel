require('dotenv').config()
var { users_clct } = require('./db_interface');
const moment = require('moment-timezone');


const {
    uid,
    uidv2,
    sleep,
    get_account,
    update_account,
    get_panel,
    get_panels,
    update_panel,
    get_all_users,
    get_user2,
    update_user,
    b2gb,
    format_number,
    get_panel_info,
    get_marzban_user,
    get_all_marzban_users,
    ping_panel,
    auth_marzban,
    insert_to_users,
    delete_vpn,
    enable_panel,
    syslog,
    get_sub_url,
    get_agents,
    get_agent_daily_usage_logs,
    set_vpn_expiry,
} = require("./utils");


async function main()
{

    await sleep(20000);

    while (true) {
        var panels_arr = await get_panels();
        for (let panel of panels_arr) {
            
            if (panel.disable)
            {
                var panel_auth_res = await auth_marzban(panel.panel_url, panel.panel_username, panel.panel_password, true);
                if(panel_auth_res == "ERR")
                {
                    continue;
                }

                else
                {
                    await enable_panel(panel.id);
                    await syslog("panel !" + panel.panel_url + " is now enabled",1);
                }
            }
            var today = new Date();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            console.log(time + " ---> fetching " + panel.panel_url);

            var info_obj = await get_panel_info(panel.panel_url, panel.panel_username, panel.panel_password);
            if (info_obj == "ERR") {
                await syslog("!ERROR : failed to fetch panel info from !" + panel.panel_url);
                await ping_panel(panel);
                continue;
            }
            else 
            {
                console.log("* fetched panel info from " + panel.panel_url);
                await update_panel(panel.id, info_obj);
            }

            
            var marzban_users = await get_all_marzban_users(panel.panel_url, panel.panel_username, panel.panel_password);
            if (marzban_users == "ERR") {
                await syslog("!ERROR : failed to fetch panel users from !" + panel.panel_url);
                continue;
            }
            console.log("* fetched users from " + panel.panel_url);



            marzban_users = marzban_users.users;

            var db_users_arr = await get_all_users();

            for (let db_user of db_users_arr) {

                var cors_panel = await get_panel(db_user.corresponding_panel_id);
                var cors_agent = await get_account(db_user.agent_id);
        
                if(!cors_panel)
                {
                    await syslog("panel not found for user !" + db_user.username + " deleting...");
                    await (await users_clct()).deleteOne({username: db_user.username});
                }
        
                if(!cors_agent)
                {
                    await syslog("agent not found for user !" + db_user.username + " deleting...");
                    await (await users_clct()).deleteOne({username: db_user.username});
                }


                var user = marzban_users.find(user => user.username == db_user.username);
                if (!user && db_user.corresponding_panel == panel.panel_url) {
                    await syslog("user !" + db_user.username + " not found in !" + panel.panel_url + " deleting...");
                    var user_obj = await get_user2(db_user.username);
                    if(!user_obj) continue;
                    var agent_obj = await get_account(user_obj.agent_id);
                    if(panel.panel_type == "MZ") if( !(agent_obj.business_mode == 1 && (user_obj.used_traffic > user_obj.data_limit/4 || (user_obj.expire - user_obj.created_at) < (Math.floor(Date.now()/1000) - user_obj.created_at)*4 )) ) await update_account(agent_obj.id, { allocatable_data: format_number(agent_obj.allocatable_data + b2gb(user_obj.data_limit - user_obj.used_traffic)) });
                    await (await users_clct()).deleteOne({ username: db_user.username });
                }
            }

            var all_agents = await get_agents();

            for (let marzban_user of marzban_users) {
                var user = db_users_arr.find(user => user.username == marzban_user.username);

                if (user) {

                    if( user.status != marzban_user.status && !(marzban_user.status == "disabled" && user.status == "disable") )
                    {
                        if (marzban_user.status == "disabled") 
                        {
                            await update_user(user.id, { status: "disable", disable: 1 });
                        }
                        
                        else
                        {
                            await update_user(user.id, { status: marzban_user.status , disable: 0 });
                        }
                    }

                    if (user.expire != marzban_user.expire) await update_user(user.id, { expire: marzban_user.expire });
                    if (user.data_limit != marzban_user.data_limit) await update_user(user.id, { data_limit: marzban_user.data_limit });
                    if (user.used_traffic != marzban_user.used_traffic) 
                    {
                        

                        if(user.safu && user.used_traffic == 0)
                        {
                            let {panel_url} = panel;
                            let {username} = user;
                            set_vpn_expiry(panel.panel_url,panel.panel_username,panel.panel_password,user.username,
                                    user.expire + (Math.floor(Date.now()/1000) - user.created_at)
                                    ).then(res => 
                                    {
                                        if(res == "ERR") syslog("!ERROR : failed to update vpn expiry for user !" + username + " in panel !" + panel_url);
                                        else syslog("updated vpn expiry for user !" + username + " in panel !" + panel_url,1);
                                    });
                        }

                        const tehran0000 = moment.tz("Asia/Tehran");
                        tehran0000.set({ hour:0,minute:0,second:0,millisecond: 0 });
                        const tehran0000_timestamp = tehran0000.unix();

                        var agent = await get_account(user.agent_id);
                        agent.volume -= marzban_user.used_traffic - user.used_traffic;
                        
                        var daily_usage_logs = await get_agent_daily_usage_logs(agent.id);
                        var existance_flag = false;

                        for(let usage_log of daily_usage_logs)
                        {
                            if(usage_log.date == tehran0000_timestamp)
                            {
                                existance_flag = true;
                                usage_log.volume += marzban_user.used_traffic - user.used_traffic;
                                break;
                            }
                        }

                        if(!existance_flag)
                        {
                            daily_usage_logs.push
                            ({
                                date: tehran0000_timestamp,
                                volume: marzban_user.used_traffic - user.used_traffic
                            });
                        }

                        await update_account(agent.id, 
                        { 
                            volume: agent.volume,
                            daily_usage_logs,
                        });

                        await update_user(user.id,
                        { 
                            used_traffic: marzban_user.used_traffic,
                            lifetime_used_traffic: user.lifetime_used_traffic + marzban_user.used_traffic - user.used_traffic
                        });
                    }


                    if(marzban_user.status == "expired" || marzban_user.status == "limited")
                    {
                        var agent = await get_account(user.agent_id);
                        if(user.disable_counter.value > agent.max_non_active_days)
                        { 
                            var result = await delete_vpn(panel.panel_url, panel.panel_username, panel.panel_password,user.username);
                            if (result != "ERR")  {
                                if(panel.panel_type == "MZ") if( !(agent.business_mode == 1 && (user.used_traffic > user.data_limit/4 || (user.expire - user.created_at) < (Math.floor(Date.now()/1000) - user.created_at)*4 )) ) await update_account(agent.id, { allocatable_data: format_number(agent.allocatable_data + b2gb(user.data_limit - user.used_traffic)) });
                                await (await users_clct()).deleteOne({ username:user.username });
                                await syslog("DELETING !" + user.username + "... (passed max-non-active-days)");
                            }  
                        }

                        else if(Math.floor(Date.now() / 1000 ) > user.disable_counter.last_update + 86400)
                        {
                            await update_user(user.id, {disable_counter: {value:user.disable_counter.value+1,last_update: Math.floor(Date.now() / 1000 )}});
                        }
                    }

                    else
                    {
                        if(user.disable_counter.value > 0)
                        {
                            await update_user(user.id, {disable_counter: {value:0,last_update: Math.floor(Date.now() / 1000 )}});
                        }
                    }
                }


                if(!user && marzban_user.username.split("_").length > 1)
                {
                    var marzban_user_created_at = Math.floor(moment.utc(marzban_user.created_at).valueOf()/1000)
                    var current_time = Math.floor(moment.utc().valueOf()/1000)
                    var corresponding_agent = all_agents.find(agent => marzban_user.username.startsWith(agent.prefix + "_"));
                    if(corresponding_agent && corresponding_agent.country.split(",").includes(panel.panel_country) && marzban_user.expire && marzban_user.data_limit && current_time - marzban_user_created_at > 60)
                    {
                        var complete_user_info = await get_marzban_user(panel.panel_url, panel.panel_username, panel.panel_password, marzban_user.username);
                        if(complete_user_info == "ERR") continue;
                        
                        var inbounds = {};
                        for(let proxy of Object.keys(complete_user_info.proxies))
                        {
                            inbounds[proxy] = {};
                            if(proxy == "vless") 
                            {
                                inbounds[proxy].flow = complete_user_info.proxies[proxy]["flow"]=="xtls-rprx-vision"?"xtls-rprx-vision":"none";
                            }
                        }

                        await insert_to_users({
                            "id": uid(),
                            "agent_id": corresponding_agent.id,
                            "status": marzban_user.status=="disabled"?"disable":marzban_user.status,
                            "disable": marzban_user.status=="disabled"?1:0,
                            "username": marzban_user.username,
                            "expire": marzban_user.expire,
                            "data_limit": marzban_user.data_limit,
                            "used_traffic": 0,
                            "lifetime_used_traffic":complete_user_info.lifetime_used_traffic,
                            "country": panel.panel_country,
                            "corresponding_panel_id": panel.id,
                            "corresponding_panel": panel.panel_url,
                            "real_subscription_url": (complete_user_info.subscription_url.startsWith("/")?panel.panel_url:"")+complete_user_info.subscription_url,
                            "subscription_url": "https://" + get_sub_url() + "/sub/" + uidv2(10),
                            "links": complete_user_info.links,
                            "created_at":Math.floor(Date.parse(marzban_user.created_at)/1000),
                            "disable_counter":{value:0,last_update:Math.floor(Date.now() / 1000)},
                            "inbounds":inbounds,
                            "safu":0,
                            "desc":"",
                            "ip_limit":complete_user_info.ip_limit || 2,
                          });

                        await update_account(corresponding_agent.id, { volume: corresponding_agent.volume + marzban_user.data_limit , lifetime_volume: corresponding_agent.lifetime_volume + marzban_user.data_limit });
                        await syslog("user !" + marzban_user.username + " was added for agent !" + corresponding_agent.username + " from panel : !" + panel.panel_url,1 );
                    }
                }
            }
        }


        await sleep(90000);
    }
}

main();