const { MongoClient } = require('mongodb');
const dbClient = new MongoClient('mongodb://mongo-knp:27017');

const { createClient } = require('redis')
const redis_client = createClient({url:'redis://redis-knp:6379'})

var accounts_clct;
var panels_clct;
var users_clct;
var logs_clct;

async function init()
{
    await dbClient.connect();
    const db = dbClient.db('KN_PANEL');

    accounts_clct = db.collection('accounts');
    panels_clct = db.collection('panels');
    users_clct = db.collection('users');
    logs_clct = db.collection('logs');

    await redis_client.connect();
}

init();

module.exports = { accounts_clct, panels_clct, users_clct, logs_clct, redis_client };