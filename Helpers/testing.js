const { check } = require('express-validator');

exports.signUpValidation = [
    // Validation for the name field
    check('name', 'Name is Required').not().isEmpty(),

    // Validation for the email field
    check('email', 'Enter a valid Email.').isEmail().normalizeEmail({ gmail_remove_dots: true })
        .custom((value, { req }) => {
            // Custom validation logic for email constraints
            const allowedDomains = ['gmail.com', 'edu', 'net', 'yahoo.com']; // Specify allowed domains
            const emailDomain = value.split('@')[1]; // Extract domain from email
            if (!allowedDomains.includes(emailDomain)) {
                // Throw error if email domain is not in the allowed list
                throw new Error('Email must be from Gmail, .edu, .net, or Yahoo domain');
            }
            return true;
        }),

    // Validation for the password field
    check('password', 'Password is Required')
        .not().isEmpty() // Ensure password is not empty
        .isLength({ min: 6, max: 15 }).withMessage('Password must be between 6 and 15 characters long') // Check password length
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter') // Check for at least one lowercase letter
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter') // Check for at least one uppercase letter
];


exports.loginValidation = [
    check('email', 'Enter a valid Email.').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check('password', 'Name is Required').not().isEmpty().isLength({ min:6 })
]

exports.studentFormValidation = [
    // check('email', 'Enter a valid Email.').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    // check('password', 'Name is Required').not().isEmpty().isLength({ min:6 })
]

exports.teacherFormValidation = [
    // check('email', 'Enter a valid Email.').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    // check('password', 'Name is Required').not().isEmpty().isLength({ min:6 })
]
