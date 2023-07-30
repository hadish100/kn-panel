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
const update_account = async (id,value) => {await accounts.updateOne({id:id},{$set:value},function(){});return "DONE";}


app.post("/api/login/" , async (req,res) =>
{

});













app.listen(6000, () => 
{
    console.log("--------------------");
    console.log("API SERVER STARTED !");
    console.log("--------------------");
});
