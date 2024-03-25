const usersModel = require('../models/users-model.js');
const postsModel = require('../models/posts-model.js');
const cloudinary = require('../config/cloudinary-config.js');



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

    // FIX ISSUE WHERE NOT ABLE TO RETRIEVE FILE FROM HTTP POST REQUEST BODY.
    //BODY-PARSER MAY NOT BE REQUIRED.
    createNewPost: async (req, res) => {
        console.log(`file uploaded: ${JSON.stringify(req.body)}`);
        this.getYourProfile;
        console.log(req.file.path);
        let result = await cloudinary.uploader.upload(req.file.path);
        console.log(result);
    }
}