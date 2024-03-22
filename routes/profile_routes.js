const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile-controller.js')
const authController = require('../controllers/auth-controller.js')
const { ensureAuth } = require("../middleware/auth-middleware.js");

router.get('/profile', ensureAuth, profileController.getYourProfile);
router.post('/logout', ensureAuth, authController.postLogout);
router.get('/new-post', ensureAuth, profileController.getCreatePost);
// To implement below
//router.get('/feed', ensureAuth, profileController.getFeed);

module.exports = router;