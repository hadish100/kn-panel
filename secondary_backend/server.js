const express = require('express');
const app = express();
var AdmZip = require("adm-zip");
const sqlite3 = require('sqlite3').verbose();
app.use(express.json());

// const db_path = "/var/lib/marzban/db.sqlite3"
const db_path = "db.sqlite3"

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


async function get_users()
{
    return new Promise((resolve, reject) => 
    {
        let db = new sqlite3.Database(db_path);
        db.all("SELECT * FROM users", (err, rows) => 
        {
            if (err) reject(err);
            else resolve(rows);
        });

        db.close();
    });
}

async function get_users_and_proxies(users_arr)
{
    return new Promise((resolve, reject) => 
    {
        let db = new sqlite3.Database(db_path);
        db.all(`SELECT * FROM users WHERE username IN (${users_arr.map((u) => `'${u}'`).join(",")})`, (err, rows) => 
        {

            db.all(`SELECT * FROM proxies WHERE user_id IN (${rows.map((v) => `'${v.id}'`).join(",")})`, (err, rows2) =>
            {
                if (err) reject(err);
                var result = [];
                for (var i = 0; i < rows.length; i++)
                {
                    result[i] = {};
                    result[i].user = rows[i];
                    result[i].proxies = [];
                    for (var j = 0; j < rows2.length; j++)
                    {
                        if (rows2[j].user_id == rows[i].id)
                        {
                            result[i].proxies.push(rows2[j]);
                        }
                    }
                }
                resolve(result);
            });

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

app.post("/ping", async (req,res) =>
{
    res.send("OK");
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



app.post("/get_marzban_users", async (req,res) =>
{
    var result = {};
    result.users = await get_users();
    res.send(result);
});


app.post("/delete_users", async (req,res) =>
{
    var { users } = req.body;

    try
    {
        var deleted_users = await get_users_and_proxies(users);
        await run_query(`DELETE FROM users WHERE username IN (${users.map((u) => `'${u}'`).join(",")})`);
        await run_query(`DELETE FROM proxies WHERE user_id IN (${deleted_users.map((u) => `'${u.user.id}'`).join(",")})`);
        res.send({status:"OK",deleted_users});
    }

    catch (err)
    {
        console.log(err);
        res.send("ERR");
    }
});




app.listen(7002);