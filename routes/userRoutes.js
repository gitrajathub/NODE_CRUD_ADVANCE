const express = require('express');
const bcrypt = require('bcrypt');
const userController = require('../controllers/userController');
const User = require('../models/userModel');
const requireAdminAuth = require('../controllers/authController');

const router = express.Router();

router.post('/signup', userController.signUp);
router.get('/login', userController.logIn);
router.delete('/deleteuser/:id', requireAdminAuth, userController.deleteUser);
router.put('/updateuser/:id', requireAdminAuth, userController.updateUser);
router.get('/adminPage', requireAdminAuth, userController.adminPage);
router.post('/forgotpassword', userController.forgotPassword);
router.post('/resetpassword', userController.resetPassword);

module.exports = router;