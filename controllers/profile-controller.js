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



module.exports = {
    getYourProfile: async (req,res) =>{
        let userPostInfo = await postsModel.getUserPosts(req.user._id);
        let currentUserInfo = await usersModel.getProfileInfo(req.user._id);

        for (let index = 0; index < userPostInfo.length; index++){
            userPostInfo[index].likesStr = convertToString(userPostInfo[index].likes);
        }
        
        res.render('profile.ejs', {userInfo: currentUserInfo, posts: userPostInfo, profilePic: currentUserInfo.profilePic, notifications: currentUserInfo.notifications});
    },

    getUserProfile: async (req, res) => {
        if (req.params.userId == req.user._id.toString()){
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
            res.render('other-user.ejs', {userInfo: currentUserInfo, posts: userPostInfo, isFollowing: authedUserFollows, profilePic: authedProfilePic, userID: req.params.userId, authedUserId: req.user._id});
        }        
    },

    getCreatePost: async (req, res) =>{
        let currentUserInfo = await usersModel.getProfileInfo(req.user._id);
        res.render('create_post.ejs', {userInfo: currentUserInfo, profilePic: currentUserInfo.profilePic, notifications: req.user.notifications});
    },

    createNewPost: async (req, res) => {
        try{
            let result = await cloudinary.uploader.upload(req.file.path, {
                allowed_formats : ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif', 'apng'], transformation: [
                    {quality: "auto:good"}
                ]
            });
            await fs.unlink(req.file.path);
            await postsModel.insertNewPost(req.user._id, result.secure_url, result.public_id);
            let info = await getProfileInfo(req.user._id);
            console.log(`Image uploaded: ${req.file.path}`);
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
                        
            res.render('authenticated-feed.ejs', {profilePic: req.user.profilePic, allPosts: posts, authedUserId: authedUserIdStr, filter: filter, notifications: req.user.notifications});
        }catch (err){
            console.error(err);
        }
    },

    getSettings: async (req, res) => {
        try{
            console.log(req.user.bio);
            res.render('settings.ejs', { profilePic : req.user.profilePic, bio: req.user.bio, notifications: req.user.notifications});

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
                res.redirect('/profile');
            } else if (!req.file && (newBio =="" || newBio == currentBio)){
                console.log('Nothing to update.');
                res.redirect('/settings');
            } else {
                let docUpdateResult = await usersModel.updateProfileInfo(userID, null, newBio, currentBio);
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
            }else{
                let cloudinaryResult;
                let postIds = postsInfo.map((post) => post._id);
                postsInfo.forEach(async (element, index)=>{ 
                    cloudinaryResult =  await cloudinary.uploader.destroy(element.cloudPublicId);
                });
                console.log(`${req.user.username} deleted ${postsInfo.length} photos/posts.`);
                const deletionResult = await postsModel.deletePosts(postIds);
                if (deletionResult){
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
        } else {
            let result = await usersModel.addFollowing(userToFollowId, req.user._id);
            if (result){
                res.status(200).json({ message: 'Successfully followed  user profile.'})
            }else{
                res.status(500).json({ message: 'Follow attempt failed.'});
            }
        }       
    },

    unFollowerUser: async (req, res) => {
        console.log(`unfollowingUser ${JSON.stringify(req.body)}`);

        let userToUnfollowId = req.body.userToUnfollow;
        let authUserIdStr = req.user._id.toString();

        if (userToUnfollowId == authUserIdStr){
            console.log("You can't follow yourself.");
        }else{
            let result = await usersModel.removeFollowing(userToUnfollowId, req.user._id);
            console.log('Called removeFollowing');
            console.log(`else result: ${JSON.stringify(result)}`);
            if (result){
                res.status(200).json({ message: 'Successfully unfollowed user profile.'});
            } else{
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
            res.render('following-list-other.ejs', { profilePic: req.user.profilePic, isFollowersList: isFollowersListVal, otherUser: otherUserInfo, followingArray: followerInfo});
        } else{
            let otherUserInfo = await usersModel.getUsernameAndPic(userId);
            let followerInfo = await usersModel.getFollowingUsers(userId, false);
            res.render('following-list-other.ejs', { profilePic: req.user.profilePic, isFollowersList: isFollowersListVal, otherUser: otherUserInfo, followingArray: followerInfo});
        }
    },

    getFollowing: async (req, res) => {
        let userId = req.params.userId;

        if (userId == undefined){
            let followingInfo = await usersModel.getFollowingUsers(req.user._id, true);
            res.render('following-list-authed.ejs', { profilePic: req.user.profilePic, followingArray: followingInfo});
        } else {
            let followingInfo = await usersModel.getFollowingUsers(userId, true);
            let otherUserInfo = await usersModel.getUsernameAndPic(userId);
            
            res.render('following-list-other.ejs', { profilePic: req.user.profilePic, isFollowersList: false, followingArray: followingInfo, otherUser: otherUserInfo});
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

                let notificationResult = await usersModel.addNotification(userToNotify, authedUserId, message, currentDate, url);
                res.status(200).json({ message: 'Successfully liked post'});
            } else {
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
            
            let notificationDelResult = await usersModel.deleteNotification(userToNotify, authedUserId, url);

            res.status(200).json({ message: 'Successfully liked post'});
        } else {
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

        res.render('post.ejs', { profilePic: req.user.profilePic, postInfo: post, authedUserId: req.user._id});
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
                console.log(`userToNotify: ${userToNotify}`);

                let notificationResult = await usersModel.addNotification(userToNotify, req.user.username, notifMessage, currentDate, url, commentId.toString());
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
                res.status(200).json({message: 'successfully delete comment.'});
            } else {
                res.status(500).json({ message: 'comment deletion failed.'})
            }
        } else {
            res.status(403).json( {message: `You aren't authorized to do that.`})
        }
    }
}