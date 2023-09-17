const sqlite3 = require('sqlite3').verbose();

const db_path = "db.sqlite3"

let db = new sqlite3.Database(db_path);

db.all("SELECT * FROM users", (err, rows) => 
{
    console.log(rows);
});

// db.run("UPDATE users SET username = 'Ava_' || username  WHERE admin_id = 2 AND id NOT IN (129)", (err) => 
// {
// if(err) console.log(err);
// console.log("SS");
// });

db.close();