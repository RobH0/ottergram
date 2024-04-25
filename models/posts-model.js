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

    async getUserPosts(userID){
        try{
            if (this.collection == null){
                await this.initCollection();
            }
            let posts = await this.collection.find({createdBy: userID}).sort({ datePosted: -1}).toArray();
            return posts;
        }catch (err){
            console.error(err);
        }
    }

    async insertNewPost(userID, imgURL, imgPublicId){
        try{
            if (this.collection == null){
                await this.initCollection();
            }
            await this.collection.insertOne({
                img: imgURL,
                cloudPublicId: imgPublicId,
                datePosted: new Date(),
                createdBy: userID,
                likes: 0,
                numComments: 0,
                deleted: false
            })

        } catch (err){
            console.error(err);
        }
    }

    async getPostsByImg(photoUrls){
        try{
            if (this.collection == null){
                await this.initCollection();
            }
            const posts = await this.collection.find({ img: { $in: photoUrls}}).toArray();
            return posts;
        }catch (err){
            console.error(err);
        }
    }

    async deletePosts(postsIds){
        try{
            if (this.collection == null){
                await this.initCollection();
            }
            const deletionResult = await this.collection.deleteMany({ _id: { $in: postsIds}});
            return deletionResult;
        }catch (err){
            console.error(err);
        }
    }
    
}

module.exports = new PostsModel;