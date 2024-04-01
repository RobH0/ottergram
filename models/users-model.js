const mongo = require('../config/database-config');
const ObjectID = require('mongodb').ObjectId;

class UsersModel{
    constructor(){
        this.collectionNameStr = 'users';
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

    async getUsernameAndPic(userID){
        try{
            if (this.collection == null){
                await this.initCollection();
            }
            let queryResult = await this.collection.findOne({_id : userID}, { projection: {_id : 0, password: 0, bio: 0}});
            
            try{
                let check = queryResult.username;
                return queryResult;
            } catch(err){
                return {
                    username: "",
                    profilePic: "/imgs/icons/otter-logo.svg"
                };
            }
            
        }catch (err){
            console.error(err);
        }
    }

    async getUser(username){
        if (this.collection == null){
            await this.initCollection();
        }
        let result = await this.collection.findOne({ username: username});

        return result;

    }

    async addNewUser(hashedPassword, newUsername){
        try{
            if (this.collection == null){
                await this.initCollection();
            }
            console.log('Attempting to add new user');
            let result = await this.getUser(newUsername)
            if (result == null){
                await this.collection.insertOne({
                    username: newUsername,
                    password: hashedPassword,
                    following: [],
                    followedBy: [],
                    profilePic: "",
                    likedPosts: []
                });
                return true;
            } else {
                return false;
            }
        }catch (err){
            console.error(err);
            return err;
        }
    }

    async getUserById(userID){
        if (this.collection == null){
            await this.initCollection();
        }
        let result = await this.collection.findOne({_id: new ObjectID(userID)});
        return result;
    }

    async getProfileInfo(userID){
        if (this.collection == null){
            await this.initCollection();
        }
        let result = await this.collection.findOne({_id : userID}, { projection: {_id : 0, password: 0}});
        //console.log(`getProfileInfo: ${JSON.stringify(result)}`);
        return result
    }

    async updateProfileInfo(userID, imgSrc, bioText){
        let result;
        if (this.collection == null){
            await this.initCollection();
        }
        
        if (bioText == "" && imgSrc === null){
            result = "No update";
            return result
        }else if (bioText != "" && imgSrc === null){
             result = await this.collection.updateOne({ _id: userID}, { $set: { bio: bioText}});
             return result;
        } else if (bioText == "" && imgSrc != null) {
            result = await this.collection.updateOne({ _id: userID}, { $set: { profilePic: imgSrc }});
            return result;
        } else {
            result = await this.collection.updateOne({ _id: userID}, { $set: { profilePic: imgSrc, bio: bioText}});
            return result;
        }
        
    }
}

module.exports = new UsersModel;