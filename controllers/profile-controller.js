const usersModel = require('../models/users-model.js');
const postsModel = require('../models/posts-model.js');
const cloudinary = require('../config/cloudinary-config.js');
const { profile } = require('console');
const { ObjectId } = require('mongodb');
const fs = require('fs').promises;

async function getProfileInfo(userID){
    let userPostInfo = await postsModel.getUserPosts(userID);
    let currentUserInfo = await usersModel.getProfileInfo(userID);
    return {postInfo: userPostInfo, userInfo: currentUserInfo}
}

function calcTimeDiff(datePosted, currentDate, abbreviated = false){
    let timeDifferenceMs = currentDate - datePosted 
            
    let seconds = Math.floor(timeDifferenceMs/1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    let weeks = Math.floor(days / 7);
    let months = Math.floor(days / 30);
    let years = Math.floor(days / 365)

    if (years >= 1){
        if (abbreviated){
            return years + 'y'
        } else {
            if (years == 1){
                return 'Posted ' + years + ' year ago';
            }
            return 'Posted ' + years + ' years ago';
        }
    } else if (months>= 1 ){
        if (abbreviated){
            return months + 'm'
        } else {
            if (months == 1){
                return 'Posted ' + months + ' month ago';
            }
            return 'Posted ' + months + ' months ago';            
        }
    } else if (weeks >= 1){
        if (abbreviated){
            return weeks + 'w'
        } else {
            if (weeks == 1){
                return 'Posted ' + weeks + ' week ago';
            }
            return 'Posted ' + weeks + ' weeks ago';
        }
    } else if (days >= 1){
        if (abbreviated){
            return days + 'd'
        } else {
            if (days == 1){
                return 'Posted ' + days + ' day ago';
            }
            return 'Posted ' + days + ' days ago';
        }
    } else if (hours >= 1){
        if (abbreviated){
            return hours + 'h'
        } else {
            if (hours == 1){
                return 'Posted ' + hours + ' hour ago';
            }
            return 'Posted ' + hours + ' hours ago';
        }
    } else if (minutes >= 1){
        if (abbreviated){
            return minutes + 'm'
        } else {
            if (minutes == 1){
                return 'Posted ' + minutes + ' minute ago';
            }
            return 'Posted ' + minutes + ' minutes ago';
        }
    }else if (seconds >= 1){
        if (abbreviated){
            return seconds + 's'
        } else {
            if (seconds == 1){
                return 'Posted ' + seconds + ' second ago';
            }
            return 'Posted ' + seconds + ' seconds ago';
        }
    }                
}

function convertToString(array){
    let newArray = array.map((element) => element.toString());
    return newArray;
}

function shortenNotificationTime(notifications){
    let currentTime = new Date();
    notifications = notifications.reverse();
    for (let index=0; index < notifications.length; index++){
         let newRelativeTime = calcTimeDiff(notifications[index].date, currentTime, true);
         notifications[index].date = newRelativeTime;
    }
    return notifications
}


module.exports = {
    getYourProfile: async (req,res) =>{
        console.log(`${new Date()} - ${req.user.username} GET /profile`);
        let userPostInfo = await postsModel.getUserPosts(req.user._id);
        let currentUserInfo = await usersModel.getProfileInfo(req.user._id);

        for (let index = 0; index < userPostInfo.length; index++){
            userPostInfo[index].likesStr = convertToString(userPostInfo[index].likes);
        }

        let notifications = shortenNotificationTime(currentUserInfo.notifications);
        
        res.render('profile.ejs', {userInfo: currentUserInfo, posts: userPostInfo, profilePic: currentUserInfo.profilePic, notifications: notifications});
    },

    getUserProfile: async (req, res) => {
        if (req.params.userId == req.user._id.toString()){
            console.log(`${req.user.username} GET /profile`);
            res.redirect('/profile');
        } else{
            let idObject = new ObjectId(req.params.userId);
            let userPostInfo = await postsModel.getUserPosts(idObject);
            let currentUserInfo = await usersModel.getProfileInfo(idObject);
            let authedUserFollows;
            let authedProfilePic = req.user.profilePic;

            let followedByStrs = currentUserInfo.followedBy.map((id) => id.toString());

            for (let index = 0; index < userPostInfo.length; index++){
                userPostInfo[index].likesStr = convertToString(userPostInfo[index].likes);
            }            
            
            if (followedByStrs.includes(req.user._id.toString())){
                authedUserFollows = true;
            } else {
                authedUserFollows = false;
            }

            let notifications = shortenNotificationTime(req.user.notifications);
            console.log(`${new Date()} - ${req.user.username} GET /user/${currentUserInfo.username}`);
            res.render('other-user.ejs', {userInfo: currentUserInfo, posts: userPostInfo, isFollowing: authedUserFollows, profilePic: authedProfilePic, userID: req.params.userId, authedUserId: req.user._id, notifications: notifications});
        }        
    },

    getCreatePost: async (req, res) =>{
        console.log(`${new Date()} - ${req.user.username} GET /new-post`);
        let currentUserInfo = await usersModel.getProfileInfo(req.user._id);
        let notifications = shortenNotificationTime(currentUserInfo.notifications);
        res.render('create_post.ejs', {userInfo: currentUserInfo, profilePic: currentUserInfo.profilePic, notifications: notifications});
    },

    createNewPost: async (req, res) => {
        try{
            let result = await cloudinary.uploader.upload(req.file.path, {
                allowed_formats : ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif', 'apng'], transformation: [
                    {quality: "auto:good"}
                ]
            });
            console.log(`${new Date()} - ${req.user.username} made a post: ${result.secure_url}`);
            await fs.unlink(req.file.path);
            await postsModel.insertNewPost(req.user._id, result.secure_url, result.public_id);
            let info = await getProfileInfo(req.user._id);
            console.log(`${new Date()} - Image uploaded: ${req.file.path}`);
            res.json({success: true});
        } catch(err) {
            console.error(`Error: ${JSON.stringify(err)}`);
        }
    },

    getPersonalizedFeed: async (req, res) => {
        try{

            let filter = req.params.filter;
            let posts; 
            if (filter == 'following'){
                let followedUsers = req.user.following;
                posts = await postsModel.getFollowingPosts(followedUsers);
            } else {
                posts = await postsModel.getAllPosts();
            }
            
            let currentDate = new Date();
            let likesArray = [];
    
            for (let index = 0; index < posts.length; index++){
                
                if (posts[index].datePosted != null){
                    let dateString = calcTimeDiff(posts[index].datePosted, currentDate);
                    posts[index].datePosted = dateString;
                }
                
                let userInfo = await usersModel.getUsernameAndPic(posts[index].createdBy);
                posts[index].postByUsername = userInfo.username;
                posts[index].profilePic = userInfo.profilePic;
                posts[index].postByUserId = userInfo._id.toString();
                posts[index].likesStr = convertToString(posts[index].likes);
            }
            
            let authedUserIdStr = req.user._id.toString();
            let notifications = shortenNotificationTime(req.user.notifications);
            
            console.log(`${new Date()} - ${req.user.username} GET /feed`);
            res.render('authenticated-feed.ejs', {profilePic: req.user.profilePic, allPosts: posts, authedUserId: authedUserIdStr, filter: filter, notifications: notifications});
        }catch (err){
            console.error(err);
        }
    },

    getSettings: async (req, res) => {
        try{
            let notifications = shortenNotificationTime(req.user.notifications);
            console.log(`${new Date()} - ${req.user.username} GET /settings`);
            res.render('settings.ejs', { profilePic : req.user.profilePic, bio: req.user.bio, notifications: notifications});

        }catch (err){
            console.error(err);
        }
    },

    postSettings: async (req, res) => {
        try{
            let newBio = req.body.bioInput;
            let userID = req.user._id;
            let currentBio = req.user.bio;

            if (req.file){
                let uploadResult = await cloudinary.uploader.upload(req.file.path, {allowed_formats : ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif', 'apng'], transformation: [
                    {quality: "auto:good"}
                ]});
                let docUpdateResult = await usersModel.updateProfileInfo(userID, uploadResult.secure_url, newBio, currentBio);
                console.log(`${new Date()} - ${req.user.username} updated their profile pic and bio`);
                res.redirect('/profile');
            } else if (!req.file && (newBio =="" || newBio == currentBio)){
                console.log(`${new Date()} - ${req.user.username} saved their profile settings without making any changes`);
                console.log('Nothing to update.');
                res.redirect('/settings');
            } else {
                let docUpdateResult = await usersModel.updateProfileInfo(userID, null, newBio, currentBio);
                console.log(`${new Date()} - ${req.user.username} updated their bio`);
                res.redirect('/profile');
            }
        }catch (err){
            console.error(err);
        }
    },
    
    deletePosts: async (req, res) =>{
        try{
            const postUrls = req.body.photoURLs;
            const userID = req.user._id.toString();
            let unauthorizedDeletionAttempt = false;
            
            const postsInfo = await postsModel.getPostsByImg(postUrls);
            let count = 0;

            while (unauthorizedDeletionAttempt === false && count < postsInfo.length){
                if (userID != postsInfo[count].createdBy.toString()){
                    unauthorizedDeletionAttempt = true;
                    console.log(`User doesn't own photo at index: ${JSON.stringify(postsInfo[count])}`);
                    console.log(`index ${count}`);
                }
                count ++;
            }

            if (unauthorizedDeletionAttempt){
                res.status(403).json({message: 'Unauthorized photo/post deletion attempt.'});
                console.log(`${new Date()} - ${req.user.username} attempted to delete photos they weren't authorized to delete`);
            }else{
                let cloudinaryResult;
                let postIds = postsInfo.map((post) => post._id);
                postsInfo.forEach(async (element, index)=>{ 
                    cloudinaryResult =  await cloudinary.uploader.destroy(element.cloudPublicId);
                });
                console.log(`${new Date()} - ${req.user.username} deleted ${postsInfo.length} photos/posts.`);
                const deletionResult = await postsModel.deletePosts(postIds);
                if (deletionResult){
                    console.log(`${new Date()} - ${req.user.username} deleted ${postIds.length} of their posts`);
                    res.status(200).json({ message: 'Posts were successfully deleted.'});                 
                }
            
            }
        }catch (err){
            console.err(err);
        }        
    },

    followUser: async (req, res) => {
        console.log(`followingUser ${JSON.stringify(req.body)}`);

        let userToFollowId = req.body.userToFollow;
        let authedUserIdStr = req.user._id.toString();

        // Making sure the authed user isn't trying to follow their own profile.
        if (userToFollowId == authedUserIdStr){
            console.log("You can't follow yourself");
            console.log(`${req.user.username} attempted to follow themself and failed`);
        } else {
            let result = await usersModel.addFollowing(userToFollowId, req.user._id);
            if (result){
                res.status(200).json({ message: 'Successfully followed  user profile.'})

                let notifMessage = `${req.user.username} followed you!`
                let currentDate = new Date();
                let url = `/user/${req.user._id.toString()}`;
                let userToNotify = userToFollowId;
                let type = 'follow';
                console.log(`url ${url}`);


                let notificationResult = await usersModel.addNotification(userToNotify, req.user.username, req.user._id, notifMessage, currentDate, url, type);
                console.log(`${new Date()} - ${req.user.username} followed: ${userToFollowId}`);
            }else{
                console.log(`${new Date()} - ${req.user.username} failed to follow: ${userToFollowId}`);
                res.status(500).json({ message: 'Follow attempt failed.'});
            }
        }       
    },

    unfollowUser: async (req, res) => {
        console.log(`unfollowingUser ${JSON.stringify(req.body)}`);

        let userToUnfollowId = req.body.userToUnfollow;
        let authUserIdStr = req.user._id.toString();

        if (userToUnfollowId == authUserIdStr){
            console.log("You can't unfollow yourself.");
        }else{
            let result = await usersModel.removeFollowing(userToUnfollowId, req.user._id);

            if (result){
                let commentMessage = `${req.user.username} followed you!`;

                //FIX: notification not being pulled from array despit match.
                let delNotifResult = usersModel.deleteNotification(userToUnfollowId, req.user.username, "/user/follow", commentMessage);
                console.log(`${new Date()} - ${req.user.username} unfollowed: ${userToUnfollowId}`);
                res.status(200).json({ message: 'Successfully unfollowed user profile.'});
            } else{
                console.log(`${new Date()} - ${req.user.username} unfollowed: ${userToUnfollowId}`);
                res.status(500).json({ message: 'Unfollow attempted failed.'});
            }
        }
    },

    getFollowers: async (req, res) => {
        let userId = req.params.userId;
        let isFollowersListVal = true;
        
        if (userId == undefined){
            let otherUserInfo = await usersModel.getUsernameAndPic(req.user._id);
            let followerInfo = await usersModel.getFollowingUsers(req.user._id, false);
            console.log(`${new Date()} - ${req.user.username} is viewing their followers.`);
            let notifications = shortenNotificationTime(req.user.notifications);
            res.render('following-list-other.ejs', { profilePic: req.user.profilePic, isFollowersList: isFollowersListVal, otherUser: otherUserInfo, followingArray: followerInfo, notifications: notifications});
        } else{
            let otherUserInfo = await usersModel.getUsernameAndPic(userId);
            let followerInfo = await usersModel.getFollowingUsers(userId, false);
            let notifications = shortenNotificationTime(req.user.notifications);
            console.log(`${new Date()} - ${req.user.username} is viewing ${otherUserInfo.username}'s followers`);
            res.render('following-list-other.ejs', { profilePic: req.user.profilePic, isFollowersList: isFollowersListVal, otherUser: otherUserInfo, followingArray: followerInfo, notifications: notifications});
        }
    },

    getFollowing: async (req, res) => {
        let userId = req.params.userId;

        if (userId == undefined){
            let followingInfo = await usersModel.getFollowingUsers(req.user._id, true);
            console.log(`${new Date()} - ${req.user.username} who they follow`);
            let notifications = shortenNotificationTime(req.user.notifications);
            res.render('following-list-authed.ejs', { profilePic: req.user.profilePic, followingArray: followingInfo, notifications: notifications});
        } else {
            let followingInfo = await usersModel.getFollowingUsers(userId, true);
            let otherUserInfo = await usersModel.getUsernameAndPic(userId);
            console.log(`${new Date()} - ${req.user.username} is viewing who ${otherUserInfo.username} follows`);
            let notifications = shortenNotificationTime(req.user.notifications);
            res.render('following-list-other.ejs', { profilePic: req.user.profilePic, isFollowersList: false, followingArray: followingInfo, otherUser: otherUserInfo, notifications: notifications});
        } 
    },

    likePost: async (req, res) => {
        try{
            const postId = req.params.postId;
            let authedUserId = req.user._id
            const result = await postsModel.likePost(postId, authedUserId);
            if (result == true){
                let currentDate = new Date();
                let message = `${req.user.username} liked one of your posts!`
                let url = req.originalUrl.split('/', 3).join('/');
                let postIdStr = url.split('/').pop();
                console.log(`postIdStr: ${postIdStr}`);
                console.log(`url: ${url}`);

                // get createdBy userId from objectID collected from post url. Use posts model.
                let postInfo = await postsModel.getPostById(postIdStr);
                let userToNotify = postInfo.createdBy;
                let type = 'like';
                let notificationResult = await usersModel.addNotification(userToNotify, req.user.username, authedUserId, message, currentDate, url, type);
                console.log(`${new Date()} - ${req.user.username} liked /post/${postIdStr} posted by ${userToNotify}.`);
                res.status(200).json({ message: 'Successfully liked post'});
            } else {
                console.log(`${new Date()} - ${req.user.username} failed liking a post`);
                res.status(500).json({ message: 'Like attempt failed.'})
            }
        } catch (err){
            console.error(err);
        }
        
    },

    unlikePost: async (req, res) => {
        const postId = req.params.postId;
        let authedUserId = req.user._id;
        let result = await postsModel.unlikePost(postId, authedUserId);
        if (result == true){
            // get createdBy userId from objectID collected from post url. Use posts model.
            const url = req.originalUrl.split('/', 3).join('/');
            let postIdStr = url.split('/').pop();
            let postInfo = await postsModel.getPostById(postIdStr);
            let userToNotify = postInfo.createdBy;
            let delNotifResult = usersModel.deleteNotification(userToNotify, req.user.username, url);
            res.status(200).json({ message: 'Successfully liked post'});
        } else {
            console.log(`${new Date()} - ${req.user.username} failed to unlike a post.`);
            res.status(500).json({ message: 'Like attempt failed.'})
        }
    },

    getPostPage: async (req, res) => {
        let currentDate = new Date();
        let post = await postsModel.getPostById(req.params.postId);
        post.likesStr = convertToString(post.likes);
        let userInfo = await usersModel.getUsernameAndPic(post.createdBy);
        post.postByUsername = userInfo.username;
        post.profilePic = userInfo.profilePic;
        post.postByUserId = userInfo._id.toString()
        if (post.datePosted != null){
            let dateString = calcTimeDiff(post.datePosted, currentDate);
            post.datePosted = dateString;
        }

        for (let index = 0; index < post.comments.length; index ++){
            let commenterObjectId = new ObjectId(post.comments[index].commentedBy);
            let commenterInfo = await usersModel.getUserById(commenterObjectId);

            post.comments[index].profilePic = commenterInfo.profilePic;
            post.comments[index].username = commenterInfo.username;
            post.comments[index].date = calcTimeDiff(post.comments[index].date, currentDate, true);
        }

        // Reversing comments array so that most recently posted comments are displayed at the top of the comments section.
        post.comments = post.comments.reverse();
        console.log(`${new Date()} - ${req.user.username} GET /post/${post._id}`);
        let notifications = shortenNotificationTime(req.user.notifications);
        res.render('post.ejs', { profilePic: req.user.profilePic, postInfo: post, authedUserId: req.user._id, notifications: notifications});
    },

    postComment: async (req, res) => {
        const currentDate = new Date();
        let authedUser = req.user._id;
        let comment = req.body.commentMsg;
        const postId = req.params.postId;
        if (comment != "" && comment != undefined){
            let commentId = await postsModel.addComment(postId, authedUser, comment, currentDate);
            if (commentId !== false){
                if (comment.length - 1 > 25){
                    comment = "'" + comment.slice(0, 25) + "...'"
                } else{
                    comment = "'" + comment + "'";
                }
                console.log(comment);
                let notifMessage = `${req.user.username} commented: ${comment} on one of your posts!`
                console.log(notifMessage);
                let url = req.originalUrl.split('/', 3).join('/');
                let postIdStr = postId.toString();
                console.log(`postIdStr: ${postIdStr}`);
                console.log(`url: ${url}`);

                // get createdBy userId from objectID collected from post url. Use posts model.
                let postInfo = await postsModel.getPostById(postIdStr);
                let userToNotify = postInfo.createdBy;
                let type = 'comment';
                console.log(`userToNotify: ${userToNotify}`);

                let notificationResult = await usersModel.addNotification(userToNotify, req.user.username, req.user._id,notifMessage, currentDate, url, type, commentId.toString());
                console.log(`${new Date()} - ${req.user.username} commented: ${comment} on /post/${postIdStr}`);
            }
        }
        
        res.redirect(`/post/${postId}`);
    },

    deleteComment: async (req, res) => {
        console.log('Deletining comment');
        const postId = req.params.postId;
        let commentId = req.body.commentId;
        const authedUserId = req.user._id;

        let postInfo = await postsModel.getPostById(postId);
        let authorizedToDelete = false;
        for (let index = 0; index < postInfo.comments.length; index++){
            if (postInfo.comments[index].commentId.toString() == commentId){
                if (postInfo.comments[index].commentedBy.toString() == authedUserId.toString()){
                    authorizedToDelete = true;
                }
            }
        }

        if (authorizedToDelete){
            let result = await postsModel.removeComment(postId, commentId, authedUserId);
            console.log('authorized to delete');
            if (result == true){
                // can't use res.redirect to responed to HTTP DELETE request.
                let url = req.originalUrl.split('/', 3).join('/');
                let postIdStr = postId.toString();
                console.log(`postIdStr: ${postIdStr}`);
                console.log(`url: ${url}`);
                let postInfo = await postsModel.getPostById(postIdStr);
                let userToNotify = postInfo.createdBy;

                usersModel.deleteNotification(userToNotify, req.user.username, url, null, commentId)
                console.log(`${new Date()} - ${req.user.username} deleted comment: ${commentId} on /post/${postIdStr}`);
                res.status(200).json({message: 'successfully delete comment.'});
            } else {
                res.status(500).json({ message: 'comment deletion failed.'});
            }
        } else {
            res.status(403).json( {message: `You aren't authorized to do that.`});
        }
    },

    //Implement updating of read status for notification.
    notificationRead: async (req, res) =>{
        console.log(`notification read ${req.body.idString}`);
        res.status(200).json({message: 'Notification marked as read.'});
    }
}