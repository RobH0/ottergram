const { MongoClient } = require('mongodb');
require('dotenv').config();

class Mongo{
    constructor(){
        this.dbConnectionURI = process.env.MONGODB_AUTH_URI;
        this.dbName = process.env.DB_NAME;
        this.client;
        this.db;        
    }

    async init(){
        try{
            this.client = await new MongoClient(this.dbConnectionURI);
            await this.client.connect();
            console.log("DB connection established.");
            this.db = this.client.db(this.dbName);
        }catch (err){
            console.error("DB connection failed.");
            console.error(err);
        }
    }

    async setCollection(collectionName){
        return this.db.collection(collectionName);
    }
}

module.exports = new Mongo;