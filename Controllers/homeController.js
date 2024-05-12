const express = require('express');
const router = express.Router();
// const { validationResult } = require('express-validator');
const db = require('../config/dbConnection');
// const jwt = require('jsonwebtoken');
// const { JWT_SECRET } = process.env;


const getProfile = (req, res) => {
    const userId = req.user.id;

    // Fetch user data from the Users table
    db.query('SELECT * FROM Users WHERE UserId = ?', userId, (error, userResult) => {
        if (error) {
            return res.status(500).send({ message: 'Error fetching user data' });
        }

        if (userResult.length === 0) {
            return res.status(404).send({ message: 'User not found' });
        }

        const userData = userResult[0];
        var userExtendedData = userResult[0];
        // Determine if the user is a student or teacher
        if (userData.UserType === 'student') {
            // Fetch student-specific data from the Students table
            db.query('SELECT * FROM Students WHERE UserId = ?', userId, (error, studentResult) => {
                if (error) {
                    return res.status(500).send({ message: 'Error fetching student data' });
                }

                if (studentResult.length === 0) {
                    return res.status(404).send({ message: 'Student data not found' });
                }

                userExtendedData = studentResult[0];

                // Fetch family members data from the FamilyMembers table
                // db.query('SELECT * FROM FamilyMembers WHERE UserId = ?', userId, (error, familyResult) => {
                //     if (error) {
                //         return res.status(500).send({ message: 'Error fetching family members data' });
                //     }

                //     // Render the profile page with all the fetched data
                //     return res.render('./profile', { userData, studentData, familyData: familyResult });
                // });
            });
        } else if (userData.UserType === 'teacher') {
            // Fetch teacher-specific data from the Teachers table
            db.query('SELECT * FROM Teachers WHERE UserId = ?', userId, (error, teacherResult) => {
                if (error) {
                    return res.status(500).send({ message: 'Error fetching teacher data' });
                }

                if (teacherResult.length === 0) {
                    return res.status(404).send({ message: 'Teacher data not found' });
                }

                userExtendedData = teacherResult[0];

                
            });
        }
        // userExtendedData
        if (userData.UserType == 'admin') {
            // For admin users, render the profile page with only user data
            return res.render('./profile', { userData });
        }

        // Fetch family members data from the FamilyMembers table
        db.query('SELECT * FROM FamilyMembers WHERE UserId = ?', userId, (error, familyResult) => {
            if (error) {
                return res.status(500).send({ message: 'Error fetching family members data' });
            }

            // Render the profile page with all the fetched data
            return res.render('./profile', { userData, userExtendedData, familyData: familyResult });
        });
    });
};



const logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
}

const volunteer = (req, res) => {
    res.render('/volunteer');
}



module.exports = {
    getProfile,
    logout,
    volunteer
}