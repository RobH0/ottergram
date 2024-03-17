const mongo = require('../config/database-config');

class PostsModel{
    constructor(){
        this.collectionNameStr = 'posts';
        this.collection;
    }

    async initCollection(){
        try{
            this.collection = await mongo.setCollection(this.collectionNameStr);
        }catch (err){
            console.error(err);
            return err;
        }
    }

    // FIX THIS. Find() doesn't return anything.
    async getAllPosts(){
        try{
            if (this.collection == null){
                await this.initCollection();
            }
            let posts = await this.collection.find().sort({ datePosted: -1}).toArray();
            return posts;
        }catch (err){
            console.error(err);
        }
    }
}

module.exports = new PostsModel;