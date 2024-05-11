const { check } = require('express-validator');

exports.signUpValidation = [
    check('name', 'Name is Required').not().isEmpty(),
    check('email', 'Enter a valid Email.').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check('password', 'Name is Required').not().isEmpty().isLength({ min:6 })
]

exports.loginValidation = [
    check('email', 'Enter a valid Email.').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check('password', 'Name is Required').not().isEmpty().isLength({ min:6 })
]