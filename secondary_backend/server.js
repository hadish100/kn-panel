const express = require('express');
const app = express();
var AdmZip = require("adm-zip");
const sqlite3 = require('sqlite3').verbose();
app.use(express.json());

const db_path = "/var/lib/marzban/db.sqlite3"

async function run_query(query)
{ 
    return new Promise((resolve, reject) => 
    {
        let db = new sqlite3.Database(db_path);
        db.run(query, (err) => 
        {
            if (err) reject(err);
            else resolve("OK");
        });

        db.close();
    });
}



app.use(async (req,res,next) =>
{
    var {api_key} = req.body;

    if (api_key != "resllmwriewfeujeh3i3ifdkmwheweljedifefhyr")
    {
        res.send("invalid api key");
        return;
    }

    next();
});

app.post("/edit_expire_times", async (req,res) => 
{
    try
    {
        var result = await run_query(`UPDATE users SET expire = expire + ${req.body.added_time}`);
        res.send("OK");
    }

    catch (err)
    {
        console.log(err);
        res.send("ERR");
    }

});

app.post("/dldb", async (req,res) =>
{
    var zip = new AdmZip();
    var zip_id = Date.now();
    var final_file = "/var/lib/bu"+zip_id+".zip"
    zip.addLocalFolder("/var/lib/marzban","lib");
    zip.addLocalFolder("/opt/marzban","opt");
    zip.writeZip(final_file);
    res.sendFile(final_file);
});



app.listen(7002);