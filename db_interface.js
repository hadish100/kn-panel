const { MongoClient } = require('mongodb');
const dbClient = new MongoClient('mongodb://mongo-knp:27017');

const { createClient } = require('redis');
const redis_client_conn = createClient({ url: 'redis://redis-knp:6379' });

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

var accounts_clct_conn;
var panels_clct_conn;
var users_clct_conn;
var logs_clct_conn;

var initialized = false;

async function init() 
{
    await dbClient.connect();
    const db = dbClient.db('KN_PANEL');

    accounts_clct_conn = db.collection('accounts');
    panels_clct_conn = db.collection('panels');
    users_clct_conn = db.collection('users');
    logs_clct_conn = db.collection('logs');

    await redis_client_conn.connect();

    initialized = true;

    console.log('DB Interface initialized');

}

init();

async function wait_for_init() 
{
    while (!initialized) 
    {
        await sleep(1000);
    }
}

async function accounts_clct()
{
    await wait_for_init();
    return accounts_clct_conn;
}

async function panels_clct()
{
    await wait_for_init();
    return panels_clct_conn;
}

async function users_clct()
{
    await wait_for_init();
    return users_clct_conn;
}

async function logs_clct()
{
    await wait_for_init();
    return logs_clct_conn;
}

async function redis_client()
{
    await wait_for_init();
    return redis_client_conn;
}

module.exports = {
    accounts_clct,
    panels_clct,
    users_clct,
    logs_clct,
    redis_client
};
