const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../config/dbConnection');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;



const register = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    db.query(
        `SELECT * from users where LOWER(email) = LOWER(${db.escape(req.body.email)});`,
        (err, result) => {
            if (result && result.length) {
                return res.status(409).send({
                    msg: 'Email already in use!'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(400).send({
                            msg: err
                        });
                    } else {
                        db.query(
                            // `SELECT * FROM users ;`,
                            `INSERT INTO users (name, email, password, UserType) VALUES (${db.escape(req.body.name)}, ${db.escape(req.body.email)}, ${db.escape(hash)}, ${db.escape(req.body.userType)});`,
                            (err, result) => {
                                if (err) {
                                    return res.status(500).send({
                                        msg: err
                                    });
                                }
                                
                                const token = jwt.sign({ id: result.insertId, userType: req.body.userType }, JWT_SECRET, { expiresIn: '1h' });
                                // res.cookie('token', token, { httpOnly: true });
                                // console.log(token, '\n');
                                
                                if (req.body.userType === 'student') {
                                    res.cookie('token', token, { httpOnly: true });
                                    return res.redirect('studentForm');
                                } else if (req.body.userType === 'teacher') {
                                    res.cookie('token', token, { httpOnly: true });
                                    return res.redirect('teacherForm');
                                } else if (req.body.userType === 'admin') {
                                    const authToken = token;
                                    res.cookie('token', token, { httpOnly: true });
                                    if (!authToken) {
                                        return res.status(401).json({ message: 'Unauthorized: Missing token' });
                                    }
                                    const decode = jwt.verify(authToken, JWT_SECRET);
                                    if (!decode) {
                                        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                                    }
                                    
                                    const studentSql = `INSERT INTO Admins (UserId) VALUES (${db.escape(decode.id)})`;
                                    // const studentSql = `select * from users;`;
                                
                                    db.query(studentSql, (err, studentResult) => {
                                        if (err) {
                                            return res.status(500).send({ msg: err });
                                        }
                                        return getAdminHome(req, res);
                                    });
                                } else {
                                    return res.status(400).send({
                                        msg: 'Invalid User Type.'
                                    });
                                }
                            }
                        );
                    }
                });
            }
        }
    );
}

const login = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    db.query(`SELECT * from Users WHERE email = ${ db.escape(req.body.email) };`, 
        (err, result) => {
            if (err) {
                return res.status(400).send({msg:err});
            }
            
            if (!result.length) {
                return res.status(401).send({ msg:'Email or Password incorrect' });
            }

            bcrypt.compare(req.body.password, result[0]['Password'], (bErr, bResult) => {
                    if (bErr) {
                        return res.status(400).send({ msg: bErr });
                    }
                    if (bResult) {
                        const token = jwt.sign({ id: result[0]['UserId'], userType: result[0]['UserType'] }, JWT_SECRET, { expiresIn: '1h' });
                        res.cookie('token', token, { httpOnly: true });
                        // console.log(result[0].UserType);
                        req.user = { id: result[0]['UserId'], userType: result[0]['UserType'] };
                        if (result[0].UserType === 'admin') {
                            
                            return getAdminHome(req, res);
                        } else {
                            return getHome(req, res);
                        }
                        // return res.status(200).send({ msg: 'Logged In', token, user: result[0] });
                    }

                    return res.status(401).send({ msg:'Email or Password incorrect' });
                }
            );
        }
    )
}


const studentForm = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const authToken = req.cookies.token;
    if (!authToken) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
    const decode = jwt.verify(authToken, JWT_SECRET);
    if (!decode) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    var registerationOption = req.body.registration_option === 'coming' ? true : false;


    // const studentSql = `INSERT INTO Students (UserId, RollNo, Department, DietaryPreferences, RegistrationStatus) VALUES (${db.escape(decode.id)}, ${db.escape(req.body.roll_number)}, ${db.escape(req.body.department)}, ${db.escape(req.body.dietary_preferences)}, ${db.escape(registerationOption)})`;
    const studentSql = `select * from users;`;

    db.query(studentSql, (err, studentResult) => {
        if (err) {
            return res.status(500).send({ msg: err });
        }
        
        // const familyMembersData = [];
        const numFamilyMembers = parseInt(req.body.family_members);
        for (let i = 1; i <= numFamilyMembers; i++) {
            const familyMemberName = req.body[`family_member_${i}_name`] || ''; // Set to empty string if undefined
            const familyMemberContact = req.body[`family_member_${i}_contact`] || ''; // Set to empty string if undefined
            const familyMemberCnic = req.body[`family_member_${i}_cnic`] || ''; // Set to empty string if undefined
            // Check if any of the family member fields are defined
            console.log("Im HEre");
            if (familyMemberName || familyMemberContact || familyMemberCnic) {
                const familySql = `INSERT INTO FamilyMembers (Name, Contact, CNIC, UserId) VALUES (?, ?, ?, ?)`;
                const familyValues = [familyMemberName, familyMemberContact, familyMemberCnic, decode.id];

                db.query(familySql, familyValues, (err, familyResult) => {
                    if (err) {
                        return res.status(500).send({ msg: err });
                    }

                    console.log(`Family member ${i} inserted successfully`);
                });
            }
        }
        db.query('SELECT * from Announcement;', (error, results) => {
            if (error) {
                return res.status(500).send({ message: 'Error fetching proposals' });
            }
    
            return res.render('home', { announcements: results });
        });
    });
};

const teacherForm = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const authToken = req.cookies.token;
    if (!authToken) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
    const decode = jwt.verify(authToken, JWT_SECRET);
    if (!decode) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    var registerationOption = req.body.registration_option === 'coming' ? true : false;


    const teacherSql = `INSERT INTO Teachers (UserId, Department, DietaryPreferences, RegistrationStatus) VALUES (${db.escape(decode.id)}, ${db.escape(req.body.department)}, ${db.escape(req.body.dietary_preferences)}, ${db.escape(registerationOption)})`;
    // const teacherSql = `select * from users;`;

    db.query(teacherSql, (err, teacherResult) => {
        if (err) {
            return res.status(500).send({ msg: err });
        }
        
        // const familyMembersData = [];
        const numFamilyMembers = parseInt(req.body.family_members);
        for (let i = 1; i <= numFamilyMembers; i++) {
            const familyMemberName = req.body[`family_member_${i}_name`] || ''; // Set to empty string if undefined
            const familyMemberContact = req.body[`family_member_${i}_contact`] || ''; // Set to empty string if undefined
            const familyMemberCnic = req.body[`family_member_${i}_cnic`] || ''; // Set to empty string if undefined
            
            // Check if any of the family member fields are defined
            if (familyMemberName || familyMemberContact || familyMemberCnic) {
                const familySql = `INSERT INTO FamilyMembers (Name, Contact, CNIC, UserId) VALUES (?, ?, ?, ?)`;
                const familyValues = [familyMemberName, familyMemberContact, familyMemberCnic, decode.id];

                db.query(familySql, familyValues, (err, familyResult) => {
                    if (err) {
                        return res.status(500).send({ msg: err }); 
                    }
                    // log msg
                    console.log(`Family member ${i} inserted successfully`);
                });
            }
        }
        db.query('SELECT * from Announcement;', (error, results) => {
            if (error) {
                return res.status(500).send({ message: 'Error fetching proposals' });
            }
    
            return res.render('home', { announcements: results });
        });
    });
}
 
const getHome = (req, res) => {
    // console.log('home called');
    // console.log(req.user);
    if (!req.user) {
        return res.status(400).json({ message: 'Please provide a valid Token' });
    }
    db.query('SELECT * from Announcement;', (error, results) => {
        if (error) {
            return res.status(500).send({ message: 'Error fetching proposals' });
        }

        return res.render('home', { announcements: results });
    });
}

const getAdminHome = (req, res) => {
    // console.log('admin callded');
    // console.log(req);
    if (!req.cookies) {
        return res.status(400).json({ message: 'Please provide a valid Token' });
    }
    
    // Query to count attending students
    db.query('SELECT COUNT(*) AS AttendingStudentsCount FROM Students WHERE RegistrationStatus = 1', (error, studentResult) => {
        if (error) {
            return res.status(500).send({ message: 'Error counting attending students' });
        }

        db.query('SELECT COUNT(*) AS AttendingTeachersCount FROM Teachers WHERE RegistrationStatus = 1', (error, result) => {
            if (error) {
                return res.status(500).send({ message: 'Error counting attending students' });
            }
            var attendees = result[0].AttendingTeachersCount + studentResult[0].AttendingStudentsCount;
            return res.render('adminHome', { attendingPeopleCount: attendees });
        });
    });
}

// ============================MIDDLE WARES ==================================
const isAuthorized = async (req, res, next) => {
    // console.log('Auth done');
    try {
        const authToken = req.cookies.token;
        if (!authToken) {
            return res.status(401).json({ message: 'Unauthorized: Missing token' });
        }
        const decode = jwt.verify(authToken, JWT_SECRET);
        if (!decode) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        
        req.user = decode;
        // If the token is valid, proceed to the next middleware or functiond
        next();
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}

const isAdmin = async (req, res, next) => {
    // console.log('asdmin done');
    try {
        const authToken = req.cookies.token;
        if (!authToken) {
            return res.status(401).json({ message: 'Unauthorized: Missing token' });
        }
        const decode = jwt.verify(authToken, JWT_SECRET);
        if (!decode) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        if (decode.userType === 'admin') {
            req.user = decode;
            // If user is valid admin, proceed to the next middleware or function
            next();
        } else {
            return res.status(401).json({ message: 'You are Unauthorized to view this page.' });
        }
        
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}


module.exports = {
    register,
    login,
    getHome,
    isAuthorized,
    isAdmin,
    studentForm,
    teacherForm,
    getAdminHome
}




// const register = (req, res) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     db.query(
//         `SELECT * from users where LOWER(email) = LOWER(${db.escape(req.body.email)});`,
//         (err, result) => {
//             if (result && result.length) {
//                 return res.status(409).send({
//                     msg: 'Email already in use!'
//                 });
//             } else {
//                 bcrypt.hash(req.body.password, 10, (err, hash) => {
//                     if (err) {
//                         return res.status(400).send({
//                             msg: err
//                         });
//                     } else {
//                         db.query(
//                             `INSERT INTO users (name, email, password, UserType) VALUES (${db.escape(req.body.name)}, ${db.escape(req.body.email)}, ${db.escape(hash)}, ${db.escape(req.body.userType)});`,
//                             (err, result) => {
//                                 if (err) {
//                                     return res.status(500).send({
//                                         msg: err
//                                     });
//                                 }
//                                 return res.status(500).send({
//                                     msg: 'User registered successfully'
//                                 });
//                             }
//                         );
//                     }
//                 });
//             }
//         }
//     );
// }
