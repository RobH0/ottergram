
const express = require('express');
const router = express.Router();
const NoAuthController = require('../controllers/no-auth-controller.js');
const authController = require('../controllers/auth-controller.js'); 

router.get('/', NoAuthController.getFeed);
router.get('/login', NoAuthController.getLogin);
router.get('/register', NoAuthController.getRegister);
router.post('/register', authController.postRegister);
router.post('/login', authController.postLogin);

module.exports = router;