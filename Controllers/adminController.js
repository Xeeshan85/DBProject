// const express = require('express');
// const router = express.Router();
// const { validationResult } = require('express-validator');
// const bcrypt = require('bcryptjs');
// const db = require('../config/dbConnection');
// const jwt = require('jsonwebtoken');
// const { JWT_SECRET } = process.env;




// const getAdminHome = (req, res) => {
//     console.log('get admn calld');
//     if (!req.user) {
//         return res.status(400).json({ message: 'Please provide a valid Token' });
//     }
//     return res.redirect('./adminHome');
// }

// const getAnnouncements = (req, res) => {
//     console.log('get admin called');
//     if (!req.user) {
//         return res.status(400).json({ message: 'Please provide a valid Token' });
//     }
//     return res.render('/announcements'); // Use absolute path
// }


// // const addAnnouncement = (req, res) => {
// //     const { description } = req.body;
// //     if (!description) {
// //         return res.status(400).json({ message: 'Description is required' });
// //     }

// //     db.query('INSERT INTO Announcement (Description) VALUES (?)', [description], (error, result) => {
// //         if (error) {
// //             return res.status(500).json({ message: 'Error adding announcement' });
// //         }
// //         return res.redirect('/announcements');
// //     });
// // };




// module.exports = {
//     getAdminHome,
//     getAnnouncements
// }