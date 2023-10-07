const sqlite3 = require('sqlite3').verbose();
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


// run_query(`DELETE FROM node_usages`).then((result) =>
// {
//     console.log(result);
// })

run_query(`UPDATE users SET used_traffic = 1647483648`).then((result) =>
{
    console.log(result);
})