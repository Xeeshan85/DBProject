const { check } = require('express-validator');

exports.signUpValidation = [
    // Validation for the name field
    check('name', 'Name is required').not().isEmpty(),
    check('name', 'Name should not be numeric').custom((value, { req }) => {
        // Custom validation logic for name field
        if (!isNaN(value)) { // Check if the value is a number
            throw new Error('Name should not be numeric');
        }
        return true;
    }),

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
const rollNumberPattern = /^(00|01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23)[ijklp][0-9]{4}$/;
exports.studentFormValidation = [
    // Validate name field
    check('name', 'Name is required').not().isEmpty(),

    // Validate roll_number field with custom pattern
    check('roll_number', 'Invalid Roll Number').matches(rollNumberPattern),

    // Validate department field
    check('department', 'Department is required').not().isEmpty(),

    // Validate registration_option field
    check('registration_option', 'Registration Option is required').not().isEmpty(),
    check('dietary_preferences').optional(),
    // Validate family_members field
    
];

exports.teacherFormValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('name', 'Name should not be numeric').custom((value, { req }) => {
        // Custom validation logic for name field
        if (!isNaN(value)) { // Check if the value is a number
            throw new Error('Name should not be numeric');
        }
        return true;
    }),
    check('dietary_preferences').optional(),
]
