const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
app.use(express.json());

const db = new sqlite3.Database('db.sqlite3', sqlite3.OPEN_READWRITE, (err) => 
{
    if (err) 
    {
        console.error(err.message);
    } 
    
    else 
    {
        console.log('Connected to the database !');

        const selectQuery = `SELECT * FROM users`;
        db.all(selectQuery, [], (err, rows) => 
        {
            if (err) 
            {
                console.error(err.message);
            } 
            
            else 
            {
                rows.forEach(row => 
                {
                    console.log(row);
                });
            }
        });
    }
});


app.post("/edit_expire_times", async (req, res) => 
{

});











app.listen(7002);