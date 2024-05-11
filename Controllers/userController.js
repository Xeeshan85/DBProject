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
                            `SELECT * FROM users ;`,
                            // `INSERT INTO users (name, email, password, UserType) VALUES (${db.escape(req.body.name)}, ${db.escape(req.body.email)}, ${db.escape(hash)}, ${db.escape(req.body.userType)});`,
                            (err, result) => {
                                if (err) {
                                    return res.status(500).send({
                                        msg: err
                                    });
                                }
                                const token = jwt.sign({ id: result[0]['UserId'], userType: req.body.userType }, JWT_SECRET, { expiresIn: '1h' });
                                res.cookie('token', token, { httpOnly: true });


                                if (req.body.userType === 'student') {
                                    return res.redirect('studentForm');
                                } else if (req.body.userType === 'teacher') {
                                    return res.redirect('teacherForm');
                                } else {
                                    // Handle other UserType cases if needed
                                    return res.status(500).send({
                                        msg: 'User registered successfully'
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
                        return res.redirect('/home');
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
}

const teacherForm = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
}

const getHome = (req, res) => {
    if (!req.user) {
        return res.status(400).json({ message: 'Please provide a valid Token' });
    }
    return res.render('./home');
}

// ============================MIDDLE WARES ==================================
const isAuthorized = async (req, res, next) => {
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
        // If the token is valid, proceed to the next middleware
        next();
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
    studentForm,
    teacherForm
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
