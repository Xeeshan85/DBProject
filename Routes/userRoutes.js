const express = require('express');
const router = express.Router();
const { signUpValidation, loginValidation, studentFormValidation } = require('../Helpers/validator');

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

router.get('/happyvolunteer', userController.isAuthorized, (req, res) => {
    res.render('happyvolunteer');
});

// router.get('/volunteer', userController.isAuthorized, (req, res) => {
//     res.render('volunteer');
// });


router.post('/studentForm', userController.studentForm);
router.post('/teacherForm', userController.teacherForm);

router.post('/volunteer', userController.isAuthorized, homeController.postVolunteer);

router.post('/register', signUpValidation, userController.register);
router.post('/login', loginValidation, userController.login);
router.get('/home', userController.isAuthorized, userController.getHome);
router.get('/home/profile', userController.isAuthorized, homeController.getProfile);
router.get('/logout', userController.isAuthorized, homeController.logout);
router.get('/volunteer', userController.isAuthorized, homeController.getVolunteer);
// router.get('/studentForm', userController.isAuthorized);
// router.get('/logout', userController.logout);


module.exports = router;