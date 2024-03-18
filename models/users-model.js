const mongo = require('../config/database-config');

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
            let queryResult = await this.collection.findOne({_id : userID}, { projection: {_id : 0, password: 0}});
            //console.log(`getUsername username: ${username.username}`);
            
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
}

module.exports = new UsersModel;