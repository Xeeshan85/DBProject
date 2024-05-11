const express = require('express');
const router = express.Router();
const { signUpValidation, loginValidation } = require('../Helpers/validator');

const userController = require('../Controllers/userController')
const homeController = require('../Controllers/homeController')

// Route for rendering the registration page
router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/studentForm', userController.isAuthorized, (req, res) => {
    res.render('studentForm');
});

router.get('/teacherForm', userController.isAuthorized, (req, res) => {
    res.render('teacherForm');
});


router.post('/register', signUpValidation, userController.register);
router.post('/login', loginValidation, userController.login);
router.get('/home', userController.isAuthorized, userController.getHome);
router.get('/home/profile', userController.isAuthorized, homeController.getProfile);
router.get('/logout', userController.isAuthorized, homeController.logout);
// router.get('/studentForm', userController.isAuthorized);
// router.get('/logout', userController.logout);


module.exports = router;