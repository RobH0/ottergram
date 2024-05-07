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

async function calcTimeDiff(datePosted, currentDate){
    let timeDifferenceMs = currentDate - datePosted 
            
    let seconds = Math.floor(timeDifferenceMs/1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    let weeks = Math.floor(days / 7);
    let months = Math.floor(days / 30);
    let years = Math.floor(days / 365)

    if (years >= 1){
        return 'Posted ' + years + ' years ago';
    } else if (months>= 1 ){
        return 'Posted ' + months + ' months ago';
    } else if (weeks >= 1){
        return 'Posted ' + weeks + ' weeks ago';
    } else if (days >= 1){
        return 'Posted ' + days + ' days ago';
    } else if (hours >= 1){
        return 'Posted ' + hours + ' hours ago';    
    } else if (minutes >= 1){
        return 'Posted ' + minutes + ' minutes ago';
    }else if (seconds >= 1){
        return 'Posted ' + seconds + ' seconds ago';
    }                
}



module.exports = {
    getYourProfile: async (req,res) =>{
        let userPostInfo = await postsModel.getUserPosts(req.user._id);
        let currentUserInfo = await usersModel.getProfileInfo(req.user._id);
        res.render('profile.ejs', {userInfo: currentUserInfo, posts: userPostInfo});
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
            
            if (followedByStrs.includes(req.user._id.toString())){
                authedUserFollows = true;
            } else {
                authedUserFollows = false;
            }
            res.render('other-user.ejs', {userInfo: currentUserInfo, posts: userPostInfo, isFollowing: authedUserFollows, profilePic: authedProfilePic, userID: req.params.userId});
        }        
    },

    getCreatePost: async (req, res) =>{
        let currentUserInfo = await usersModel.getProfileInfo(req.user._id);
        res.render('create_post.ejs', {userInfo: currentUserInfo});
    },

    createNewPost: async (req, res) => {
        try{
            let result = await cloudinary.uploader.upload(req.file.path, {allowed_formats : ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif', 'apng']});
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
            let posts = await postsModel.getAllPosts();
            let currentDate = new Date();
    
            for (let index = 0; index < posts.length; index++){
                
                if (posts[index].datePosted != null){
                    let dateString = await calcTimeDiff(posts[index].datePosted, currentDate);
                    posts[index].datePosted = dateString;
                }
                
                let userInfo = await usersModel.getUsernameAndPic(posts[index].createdBy);
                posts[index].postByUsername = userInfo.username;
                posts[index].profilePic = userInfo.profilePic;
                posts[index].postByUserId = userInfo._id.toString();
            }
            res.render('authenticated-feed.ejs', {profilePic: req.user.profilePic, allPosts: posts});
        }catch (err){
            console.error(err);
        }
    },

    getSettings: async (req, res) => {
        try{
            console.log(req.user.bio);
            res.render('settings.ejs', { profilePic : req.user.profilePic, bio: req.user.bio});

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
                let uploadResult = await cloudinary.uploader.upload(req.file.path, {allowed_formats : ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif', 'apng']});
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
        console.log(userId);
        console.log('executing getFollowers');
        if (userId == undefined){
            res.render('followers-list.ejs')
        } else{
            res.render('followers-list.ejs')
        }
    },

    getFollowing: async (req, res) => {
        let userId = req.params.userId;
        if (userId == undefined){
            let followingInfo = await usersModel.getFollowingUsers(req.user._id);
            res.render('following-list-authed.ejs', { profilePic: req.user.profilePic, followingArray: followingInfo});
        } else {
            let followingInfo = usersModel.getFollowingUsers(userId);
            res.render('following-list-other.ejs', { profilePic: req.user.profilePic});
        }
    }
}