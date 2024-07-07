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

    async getAllUsernames(){
        try{
            if (this.collection == null){
                await this.initCollection();
            }

            let usernames = await this.collection.find({}, { projection: { username: 1, _id: 0}}).toArray();
            
            usernames = usernames.map((element) => element.username.toLowerCase());
            return usernames;
        } catch (err){
            console.log(err);
            return false
        }
    }

    async getUsernameAndPic(userID){
        try{
            if (this.collection == null){
                await this.initCollection();
            }
            if (typeof(userID) == 'string'){
                userID = new ObjectID(userID);
            }

            let queryResult = await this.collection.findOne({_id : userID}, { projection: {password: 0, bio: 0}});
            
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
                    likedPosts: [],
                    notifications: []
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
        let result = await this.collection.findOne({_id : userID}, { projection: {password: 0}});
        //console.log(`getProfileInfo: ${JSON.stringify(result)}`);
        return result
    }

    async updateProfileInfo(userID, imgSrc, bioText, oldBio){
        let result;
        if (this.collection == null){
            await this.initCollection();
        }
        
        if ((bioText == "" || bioText == oldBio) && imgSrc === null){
            result = "No update";
            return result
        }else if ((bioText != "" && bioText != oldBio) && imgSrc === null){
             result = await this.collection.updateOne({ _id: userID}, { $set: { bio: bioText}});
             return result;
        } else if ((bioText == "" || bioText == oldBio) && imgSrc != null) {
            result = await this.collection.updateOne({ _id: userID}, { $set: { profilePic: imgSrc }});
            return result;
        } else {
            result = await this.collection.updateOne({ _id: userID}, { $set: { profilePic: imgSrc, bio: bioText}});
            return result;
        }
        
    }

    async addFollowing(userIdToFollow, authedUserId){
        if (this.collection == null){
            await this.initCollection();
        }

        try{
            userIdToFollow = new ObjectID(userIdToFollow);
        
            let result = await this.collection.updateOne({_id: authedUserId}, {$addToSet: { following: userIdToFollow}});
            let result2 = await this.collection.updateOne({_id: userIdToFollow}, {$addToSet: { followedBy: authedUserId}});
            console.log(`follow result: ${JSON.stringify(result)}`);
            return true;
        }catch (err){
            console.error(err);
            return false;
        }        
    }

    async removeFollowing(userIdToUnfollow, authedUserId){
        if (this.collection == null){
            await this.initCollection();
        }

        try{
            console.log(`userIdToUnFollow: ${userIdToUnfollow}`);
            userIdToUnfollow = new ObjectID(userIdToUnfollow);
            let result = await this.collection.updateOne({_id: authedUserId}, {$pull: { following: userIdToUnfollow}});
            
            let result2 = await this.collection.updateOne({_id: userIdToUnfollow}, {$pull: { followedBy: authedUserId}});
            return true;
        }catch (err){
            console.error(err);
            return false;
        }
    }

    async getFollowingUsers(userId, following){
        if (this.collection == null){
            await this.initCollection();
        }

        let followingUserInfo = [];

        try{
            if (typeof(userId) == 'string'){
                userId = new ObjectID(userId);
            }
            let result = await this.collection.findOne({_id: userId}, { projection: {_id : 0, password: 0, profilePic: 0, likedPosts: 0, bio: 0}});


            let userIdList;
            
            if (following == true){
                userIdList = result.following;
            } else {
                userIdList = result.followedBy
            }

            // Had to loop through array using for await since MongoDB does n't support queries that attempt to select/find documents whose _id matches any ObjectIDs within an array using '$in'.
            for await (let user of userIdList){
                let userInfo = await this.collection.findOne({_id: user}, { projection: {password: 0, followedBy: 0, likedPosts: 0, bio: 0, following: 0}});
                userInfo._id = JSON.stringify(userInfo._id)
                userInfo._id = userInfo._id.substring(1, userInfo._id.length -1);
                followingUserInfo.push(userInfo);
            }
            return followingUserInfo;
        } catch(err) {
            console.error(err);
            return false
        }
    }

    async checkNotificationsExists(userId){
        if (this.collection == null){
            await this.initCollection();
        }
        console.log('checkNotificationsExists');
        let userNotifications = await this.collection.findOne({_id: userId}, { projection: {notifications: 1}});

        return userNotifications;
    }

    async addNotification(impactedUserId, actionByUsername, actionById, notificationMessage, dateTime, url, notificationType, commentId = null){
        if (this.collection == null){
            await this.initCollection();
        }
        if (typeof(impactedUserId) == 'string'){
            console.log('in impacteduser id conversion')
            impactedUserId = new ObjectID(impactedUserId);
        }
        // Fix this where notification is being added for like or comment now if statement wasn't added.
        console.log(`impactedUserId: ${impactedUserId.toString()}`);
        console.log(`actionById: ${actionById.toString()}`);
        if (impactedUserId.toString() != actionById.toString()){
            console.log('add notification in if');
            let newNotification = {
                id: new ObjectID(),
                actionBy: actionByUsername, 
                message: notificationMessage, 
                date: dateTime,
                read: false,
                relatedURL: url,
                type: notificationType 
            }
            
            console.log(`commentId typeof: ${typeof(commentId)}`);
    
            if (commentId != null){
                newNotification["relatedComment"] = commentId;
            }
    
            console.log(`impactuserId: ${impactedUserId}`);
            let updateResult;
            let notificationsExist = await this.checkNotificationsExists(impactedUserId);
    
            console.log('in updateNotifcations')
            
            if (notificationsExist.notifications != null){
                updateResult = await this.collection.updateOne({_id: impactedUserId}, { $push: { notifications: newNotification}});
            } else {
                newNotification = [newNotification];
                updateResult = await this.collection.updateOne({_id: impactedUserId}, {$set: { notifications: newNotification}});
            }
            if (updateResult.modifiedCount > 0) {
                console.log(`notification added to user profile: ${impactedUserId.toString()}`);
                return true;
            } else {
                return false;
            }
        }
        console.log('Action caused by authenticated user.');
    }

    async deleteNotification(impactedUserId, actionByUsername, originalUrl, notifMessage = null, commentId = null){
        if (this.collection == null){
            await this.initCollection();
        }

        if (typeof(impactedUserId) == 'string'){
            console.log('in impacteduser id conversion')
            impactedUserId = new ObjectID(impactedUserId);
        }

        console.log(commentId);

        let notificationsExist = await this.checkNotificationsExists(impactedUserId);

        let pullNotifSegment;

        if (notifMessage == null && commentId == null){
            pullNotifSegment = {$pull: {notifications: {relatedURL: originalUrl, actionBy: actionByUsername}}}
        } else if (notifMessage != null && commentId == null){
            pullNotifSegment = {$pull: {notifications: {relatedURL: originalUrl, actionBy: actionByUsername, message: notifMessage}}}
        } else if (notifMessage == null  && commentId != null){
            pullNotifSegment = {$pull: {notifications: {relatedURL: originalUrl, actionBy: actionByUsername, relatedComment: commentId}}}
        }

        console.log(`pullNotifSegment ${JSON.stringify(pullNotifSegment)}`);

        if (notificationsExist.notifications != null){
            const delNotifResult = await this.collection.updateOne({_id: impactedUserId}, pullNotifSegment);

            console.log(JSON.stringify(delNotifResult));
            if (delNotifResult.modifiedCount > 0){
                return true;
            } else {
                return false;
            }
        }
    }

    async markRead(notificationId, userId){
        if (typeof(notificationId) == 'string'){
            console.log('in impacteduser id conversion')
            notificationId = new ObjectID(notificationId);
        }
        if (typeof(userId) == 'string'){
            console.log('in impacteduser id conversion')
            userId = new ObjectID(userId);
        }

        let result = await this.collection.updateOne({_id: userId, "notifications.id": notificationId}, {$set: {"notifications.$.read": true}});

        console.log(result);
        if (result.modifiedCount > 0){
            return true;
        } else {
            false;
        }
    }
}

module.exports = new UsersModel;