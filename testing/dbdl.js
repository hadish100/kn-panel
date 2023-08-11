const fs = require('fs');
const AdmZip = require('adm-zip');

const {
    connect_to_db,
    get_all_users,
    get_accounts,
    get_panels,
    get_logs
} = require("../utils");


connect_to_db().then(res => {
    accounts_clct = res.accounts_clct;
    panels_clct = res.panels_clct;
    users_clct = res.users_clct;
    logs_clct = res.logs_clct;
    dbdl();
});


async function dbdl()
{
    

    var users = await get_all_users();
    var accounts = await get_accounts();
    var panels = await get_panels();
    var logs = await get_logs();

    await fs.promises.writeFile("dbbu/users.json",JSON.stringify(users));
    await fs.promises.writeFile("dbbu/accounts.json",JSON.stringify(accounts));
    await fs.promises.writeFile("dbbu/panels.json",JSON.stringify(panels));
    await fs.promises.writeFile("dbbu/logs.json",JSON.stringify(logs));

    var zip = new AdmZip();

    zip.addLocalFile(__dirname + "/dbbu/users.json");
    zip.addLocalFile(__dirname + "/dbbu/accounts.json");
    zip.addLocalFile(__dirname + "/dbbu/panels.json");
    zip.addLocalFile(__dirname + "/dbbu/logs.json");
    var willSendthis = zip.toBuffer();

    zip.writeZip(__dirname + "/dbbu/db.zip");
    console.log("DONE !!!");

}