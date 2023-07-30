const express = require('express');
const app = express();
const axios = require('axios');
const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
app.use(express.json());

var db,accounts;
(async function connect_to_db()
{
    await client.connect();
    db = client.db('KN_PANEL');
    accounts = db.collection('accounts');
})();



// --- UTILS --- //

const uid = () => { return Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000; }

const insert_to_accounts = async (obj) => { await accounts.insertOne(obj);return "DONE"; }
const get_accounts = async () => {const result = await accounts.find().toArray();return result;}
const get_account = async (id) => {const result = await accounts.find({id}).toArray();return result[0];}
const update_account = async (id,value) => {await accounts.updateOne({id},{$set:value},function(){});return "DONE";}

const add_token = async (id) => 
{
    var expire = Math.floor(Date.now()/1000) + 3600;
    var token = uid();
    var obj = { token , expire };
    await accounts.updateOne({id},{$push:{tokens:obj}},function(){});return token;
}


app.post("/api/login/" , async (req,res) =>
{
    const {username,password} = req.body;
    const accounts = await get_accounts();
    const account = accounts.filter(x => x.username == username && x.password == password)[0];

    if(account)
    {
        var access_token = await add_token(account.id);
        res.json({is_admin:account.is_admin,access_token});
    }

    else
    {
        res.status(400).send({message: 'NOT FOUND'});
    }

});





app.listen(6000, () => 
{
    console.log("--------------------");
    console.log("API SERVER STARTED !");
    console.log("--------------------");
});
