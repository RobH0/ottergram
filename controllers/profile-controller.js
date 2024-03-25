const usersModel = require('../models/users-model.js');
const postsModel = require('../models/posts-model.js');
const cloudinary = require('../config/cloudinary-config.js');
const fs = require('fs').promises;



module.exports = {
    getYourProfile: async (req,res) =>{
        console.log(JSON.stringify(req.user));
        let userPostInfo = await postsModel.getUserPosts(req.user._id);
        let currentUserInfo = await usersModel.getProfileInfo(req.user._id);
        console.log(userPostInfo[0]._id);
        res.render('profile.ejs', {userInfo: currentUserInfo, posts: userPostInfo});
    },

    getCreatePost: async (req, res) =>{
        let currentUserInfo = await usersModel.getProfileInfo(req.user._id);
        console.log(JSON.stringify(currentUserInfo.profilePic));
        res.render('create_post.ejs', {userInfo: currentUserInfo});
    },

    // To do: implement error handling.
    createNewPost: async (req, res) => {
        console.log(`file uploaded: ${JSON.stringify(req.body)}`);
        this.getYourProfile;
        console.log(req.file.path);
        let result = await cloudinary.uploader.upload(req.file.path);
        console.log(result);
        await fs.unlink(req.file.path);
    }
}