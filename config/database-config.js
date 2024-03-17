const { MongoClient } = require('mongodb');
require('dotenv').config();

class Mongo{
    constructor(){
        this.dbConnectionURI = process.env.MONGODB_AUTH_URI;
        this.dbName = process.env.DB_NAME;
        this.client;
        this.db;
        this.collection;        
    }

    async init(){
        try{
            this.client = new MongoClient(this.dbConnectionURI);
            await this.client.connect();
            console.log("DB connection established.");
            this.db = this.client.db(this.dbName);
        }catch (err){
            console.error("DB connection failed.");
            console.error(err);
        }
    }

    async setCollection(collectionName){
        return await this.db.collection(collectionName);
    }
}

module.exports = new Mongo;