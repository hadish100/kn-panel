const {insert_to_users,connect_to_db,sleep,uid} = require("./utils");


connect_to_db().then(res => {
    accounts_clct = res.accounts_clct;
    panels_clct = res.panels_clct;
    users_clct = res.users_clct;
    logs_clct = res.logs_clct;
});


(async () => 
{
    await sleep(5000);

    for(var i=0;i<100;i++)
    {
        var obj =  {
          "id": uid(),
          "agent_id": 214655343,
          "status": "active",
          "disable": 0,
          "username": "RT_test3553",
          "expire": 1694095487,
          "data_limit": 10737418240,
          "used_traffic": 0,
          "country": "HH1",
          "corresponding_panel_id": 704679451,
          "corresponding_panel": "https://p1.shetab21.com:8000",
          "subscription_url": "TEST",
          "links": ["TEST","TEST","TEST","TEST","TEST"]
        }

        await insert_to_users(obj);
        console.log("inserted user " + i);
    }

})();