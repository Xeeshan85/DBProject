const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
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



const getVolunteer = (req, res) => {
    const userId = req.user.id;

    db.query('SELECT * FROM Tasks;', (error, taskResults) => {
        if (error) {
            return res.status(500).send({ message: 'Error fetching user data' });
        }

        if (taskResults.length === 0) {
            return res.status(404).send({ message: 'Tasks not found' });
        }

        return res.render('./volunteer', { taskResults }); // Pass taskResults directly
    });
}

const postVolunteer = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const taskIds = req.body.tasks;

    if (!Array.isArray(taskIds)) {
        return res.status(400).json({ message: 'Invalid data format for task IDs' });
    }

    // function to check if a task is already registered by the user
    const isTaskAlreadyRegistered = (taskId, callback) => {
        db.query('SELECT * FROM StudentTasks WHERE UserId = ? AND TaskId = ?', [userId, taskId], (error, result) => {
            if (error) {
                // Handle database error
                console.error('Error checking task registration:', error);
                callback(error, null);
            } else {
                // If a row exists, the task is already registered
                const isRegistered = result.length > 0;
                callback(null, isRegistered);
            }
        });
    };

    // Check if any of the tasks are already registered
    const tasksAlreadyRegistered = [];
    const tasksToRegister = [];

    taskIds.forEach(taskId => {
        isTaskAlreadyRegistered(taskId, (error, isRegistered) => {
            if (error) {
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (isRegistered) {
                tasksAlreadyRegistered.push(taskId);
            } else {
                tasksToRegister.push(taskId);
            }

            // If all tasks have been checked, proceed with registration
            if (tasksAlreadyRegistered.length + tasksToRegister.length === taskIds.length) {
                // If any tasks are already registered, return error message
                if (tasksAlreadyRegistered.length > 0) {
                    return res.status(409).json({ message: 'One or more tasks are already registered' });
                }

                // Insert new tasks into the StudentTasks table
                tasksToRegister.forEach(taskId => {
                    db.query('INSERT INTO StudentTasks (UserId, TaskId) VALUES (?, ?)', [userId, taskId], (error, result) => {
                        if (error) {
                            console.error('Error inserting task:', error);
                        }
                    });
                });

                return res.redirect('./happyvolunteer');
            }
        });
    });
};




module.exports = {
    getProfile,
    logout,
    getVolunteer,
    postVolunteer
}