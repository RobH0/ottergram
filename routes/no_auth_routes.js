
const express = require('express');
const router = express.Router();
const NoAuthController = require('../controllers/no-auth-controller.js');
const authController = require('../controllers/auth-controller.js');
const { ensureAuth } = require("../middleware/auth-middleware.js"); 

router.get('/', ensureAuth, NoAuthController.getFeed);
router.get('/login', ensureAuth, NoAuthController.getLogin);
router.get('/register', ensureAuth, NoAuthController.getRegister);
router.post('/register', authController.postRegister);
router.post('/login', authController.postLogin);

module.exports = router;