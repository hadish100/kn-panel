const { MongoClient } = require('mongodb');
const { createClient } = require('redis');

// MongoDB and Redis clients
const dbClient = new MongoClient('mongodb://mongo-knp:27017');
const redis_client = createClient({ url: 'redis://redis-knp:6379' });

let accounts_clct;
let panels_clct;
let users_clct;
let logs_clct;

let initialized = false;

async function init() 
{
    if (!initialized) 
    {
        await dbClient.connect();
        const db = dbClient.db('KN_PANEL');

        accounts_clct = db.collection('accounts');
        panels_clct = db.collection('panels');
        users_clct = db.collection('users');
        logs_clct = db.collection('logs');

        await redis_client.connect();

        initialized = true;
    }
}


init()

module.exports = 
{
    get accounts_clct() {
        if (!initialized) throw new Error('Database not initialized');
        return accounts_clct;
    },
    get panels_clct() {
        if (!initialized) throw new Error('Database not initialized');
        return panels_clct;
    },
    get users_clct() {
        if (!initialized) throw new Error('Database not initialized');
        return users_clct;
    },
    get logs_clct() {
        if (!initialized) throw new Error('Database not initialized');
        return logs_clct;
    },
    get redis_client() {
        if (!initialized) throw new Error('Redis client not initialized');
        return redis_client;
    }
};
