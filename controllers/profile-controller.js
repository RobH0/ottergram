const usersModel = require('../models/users-model.js');
const postsModel = require('../models/posts-model.js');
const cloudinary = require('../config/cloudinary-config.js');
const fs = require('fs').promises;

async function getProfileInfo(userID){
    let userPostInfo = await postsModel.getUserPosts(userID);
    let currentUserInfo = await usersModel.getProfileInfo(userID);
    return {postInfo: userPostInfo, userInfo: currentUserInfo}
}

module.exports = {
    getYourProfile: async (req,res) =>{
        let userPostInfo = await postsModel.getUserPosts(req.user._id);
        let currentUserInfo = await usersModel.getProfileInfo(req.user._id);
        res.render('profile.ejs', {userInfo: currentUserInfo, posts: userPostInfo});
    },

    getCreatePost: async (req, res) =>{
        let currentUserInfo = await usersModel.getProfileInfo(req.user._id);
        res.render('create_post.ejs', {userInfo: currentUserInfo});
    },

    createNewPost: async (req, res) => {
        try{
            let result = await cloudinary.uploader.upload(req.file.path, {allowed_formats : ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif', 'apng']});
            await fs.unlink(req.file.path);
            await postsModel.insertNewPost(req.user._id, result.secure_url);
            let info = await getProfileInfo(req.user._id);
            console.log(`Image uploaded: ${req.file.path}`);
            res.json({success: true});
        } catch(err) {
            console.error(`Error: ${JSON.stringify(err)}`);
        }
    }
}