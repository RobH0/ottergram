const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile-controller.js')
const authController = require('../controllers/auth-controller.js')
const { ensureAuth } = require("../middleware/auth-middleware.js");
const multer = require("../middleware/multer-middleware.js")

router.get('/profile', ensureAuth, profileController.getYourProfile);
router.post('/logout', ensureAuth, authController.postLogout);
router.get('/new-post', ensureAuth, profileController.getCreatePost);
router.post('/new-post', ensureAuth, multer.single('file'), profileController.createNewPost);
router.get('/feed', ensureAuth, profileController.getPersonalizedFeed);
router.get('/settings', ensureAuth, profileController.getSettings);
router.post('/settings', ensureAuth, multer.single('changeProfilePic'),profileController.postSettings);
router.delete('/profile/delete-posts', ensureAuth, profileController.deletePosts);
router.get('/user/:userId', ensureAuth, profileController.getUserProfile);
router.patch('/user', ensureAuth, profileController.followUser);

module.exports = router;