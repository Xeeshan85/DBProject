const express = require('express');
const router = express.Router();
const { signUpValidation, loginValidation } = require('../Helpers/validator');

const userController = require('../Controllers/userController');
const homeController = require('../Controllers/homeController');
const { getAdminHome } = require('../Controllers/adminController');

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


router.post('/studentForm', userController.studentForm);
router.post('/teacherForm', userController.teacherForm);
router.post('/addDinnerItem', userController.isAuthorized, homeController.addDinnerItem);
router.post('/dinnerVote', userController.isAuthorized, homeController.dinnerVote);
router.post('/proposals', userController.isAuthorized, homeController.getProposals);
router.post('/voteProposal', userController.isAuthorized, homeController.voteProposal);

router.post('/volunteer', userController.isAuthorized, homeController.postVolunteer);

router.post('/register', signUpValidation, userController.register);
router.post('/login', loginValidation, userController.login);

router.get('/home', userController.isAuthorized, userController.getHome);
router.get('/home/profile', userController.isAuthorized, homeController.getProfile);
router.get('/logout', userController.isAuthorized, homeController.logout);
router.get('/volunteer', userController.isAuthorized, homeController.getVolunteer);
router.get('/DinnerMenu', userController.isAuthorized, homeController.getMenu);
router.get('/proposals', userController.isAuthorized, homeController.getProposals);


router.get('/adminHome', userController.isAdmin, userController.getAdminHome);
router.get('/announcements', userController.isAdmin, homeController.getAnnouncements);
router.post('/addAnnouncement', userController.isAuthorized, homeController.addAnnouncement);

router.get('/budget', userController.isAdmin, homeController.getBudget);
router.post('/budget', userController.isAdmin, homeController.addTaskToBudget);
router.post('/budget', userController.isAdmin, homeController.editTaskInBudget);
router.post('/budget', userController.isAdmin, homeController.removeTaskFromBudget);


router.get('/promotions', userController.isAdmin, homeController.getPromotions);

module.exports = router;