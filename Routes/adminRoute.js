// const express = require('express');
// const router = express.Router();
// const { signUpValidation, loginValidation } = require('../Helpers/validator');


// const userController = require('../Controllers/userController');
// const homeController = require('../Controllers/homeController');
// const adminController = require('../Controllers/adminController');


// router.get('/register', (req, res) => {
//     res.render('register');
// });

// router.get('/login', (req, res) => {
//     res.render('login');
// });

// // router.get('/login', (req, res) => {
// //     res.render('login');
// // });



// router.get('/adminHome', userController.isAdmin, adminController.getAdminHome);
// router.get('/announcements', userController.isAdmin, adminController.getAnnouncements);


// module.exports = router;