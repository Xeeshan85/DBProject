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
        var familiesResult = userResult[0];
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

        if (userData.UserType == 'admin') {
            // For admin users, render the profile page with only user data
            return res.render('./profile', { userData });
        }

        // Fetch family members data from the FamilyMembers table
        db.query('SELECT * FROM FamilyMembers WHERE UserId = ?', userId, (error, familyResult) => {
            if (error) {
                return res.status(500).send({ message: 'Error fetching family members data' });
            }
            familiesResult = familyResult;
            // Render the profile page with all the fetched data
            // return res.render('./profile', { userData, userExtendedData, familyData: familyResult });
        });

         db.query('SELECT Tasks.Name, Tasks.Description FROM StudentTasks JOIN Tasks ON StudentTasks.TaskId = Tasks.TaskId WHERE StudentTasks.UserId = ?', userId, (error, volunteerResults) => {
            if (error) {
                return res.status(500).send({ message: 'Error fetching family members data' });
            }
            
            return res.render('./profile', { userData, userExtendedData, volunteerResults, familyData: familiesResult });
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

const getMenu = (req, res) => {
    const userId = req.user.id;

    db.query('SELECT d.ItemId, d.Name, d.Description, COUNT(v.ItemId) AS TotalVotes FROM DinnerItems d LEFT JOIN DinnerVotes v ON d.ItemId = v.ItemId GROUP BY d.ItemId, d.Name, d.Description', (error, results) => {
        if (error) {
            console.error('Error fetching dinner items:', error);
            return res.status(500).send({ message: 'Error fetching dinner items' });
        }

        res.render('DinnerMenu', { dinnerItems: results });
    });
};

const addDinnerItem = (req, res) => {
    const { itemName, itemDescription } = req.body;
    
    // Check if the item already exists in the DinnerItems table
    db.query('SELECT * FROM DinnerItems WHERE Name = ?', itemName, (error, results) => {
        if (error) {
            console.error('Error checking if dinner item exists:', error);
            return res.status(500).send({ message: 'Error checking if dinner item exists' });
        }

        if (results.length === 0) {
            // If the item does not exist, insert it into the DinnerItems table
            db.query('INSERT INTO DinnerItems (Name, Description) VALUES (?, ?)', [itemName, itemDescription], (error, results) => {
                if (error) {
                    console.error('Error adding dinner item:', error);
                    return res.status(500).send({ message: 'Error adding dinner item' });
                }
                // Redirect to the getMenu controller to refresh the menu
                // res.render('/getMenu');
            });
        }
        
        const userId = req.user.id;

        db.query('SELECT d.ItemId, d.Name, d.Description, COUNT(v.ItemId) AS TotalVotes FROM DinnerItems d LEFT JOIN DinnerVotes v ON d.ItemId = v.ItemId GROUP BY d.ItemId, d.Name, d.Description', (error, results) => {
            if (error) {
                console.error('Error fetching dinner items:', error);
                return res.status(500).send({ message: 'Error fetching dinner items' });
            }

            res.render('DinnerMenu', { dinnerItems: results });
        });
    });
};

const dinnerVote = (req, res) => {
    const userId = req.user.id;
    const itemId = req.body.itemId;
    // console.log('Vote Called');
    // console.log(itemId);
    // Check if the user has already voted for this item
    db.query('SELECT * FROM DinnerVotes WHERE UserId = ? AND ItemId = ?', [userId, itemId], (error, result) => {
        if (error) {
            console.error('Error checking vote:', error);
            return res.status(500).json({ message: 'Error checking vote' });
        }

        // If the user has already voted for this item, return an error
        if (result.length > 0) {
            return res.status(400).json({ message: 'You have already voted for this item' });
        }

        db.query('INSERT INTO DinnerVotes (UserId, ItemId) VALUES (?, ?)', [userId, itemId], (error, result) => {
            if (error) {
                console.error('Error adding vote:', error);
                return res.status(500).json({ message: 'Error adding vote' });
            }

            db.query('SELECT d.ItemId, d.Name, d.Description, COUNT(v.ItemId) AS TotalVotes FROM DinnerItems d LEFT JOIN DinnerVotes v ON d.ItemId = v.ItemId GROUP BY d.ItemId, d.Name, d.Description', (error, results) => {
                if (error) {
                    console.error('Error fetching dinner items:', error);
                    return res.status(500).send({ message: 'Error fetching dinner items' });
                }

                res.render('DinnerMenu', { dinnerItems: results });
            });
        });
    });
};

// const getProposals = (req, res) => {
//     const userId = req.user.id;

//     db.query('SELECT p.*, COUNT(v.ProposalId) AS TotalVotes FROM Proposals p LEFT JOIN ProposalVotes v ON p.ProposalId = v.ProposalId GROUP BY p.ProposalId', (error, results) => {
//         if (error) {
//             return res.status(500).send({ message: 'Error fetching proposals' });
//         }

//         return res.render('proposals', { proposals: results });
//     });
// };

const getProposals = (req, res) => {

    if (req.method === 'POST' && req.body.proposalName) {
        const proposalName = req.body.proposalName.trim();
        const description = req.body.description.trim();
        const durationInMinutes = parseInt(req.body.duration); // Convert duration to integer
        const additionalRequirements = req.body.additionalRequirements.trim();
        
        // Check if the proposal already exists
        db.query('SELECT * FROM Proposals WHERE ProposalType = ?', [proposalName], (error, results) => {
            if (error) {
                return res.status(500).send({ message: 'Error checking existing proposals' });
            }

            if (results.length === 0) {
                // If the proposal doesn't exist, insert it into the database
                db.query('INSERT INTO Proposals (ProposalType, Description, Duration, AdditionalRequirements) VALUES (?, ?, ?, ?)', [proposalName, description, durationInMinutes, additionalRequirements], (error, result) => {
                    if (error) {
                        return res.status(500).send({ message: 'Error adding new proposal' });
                    }
                });
            }

            return res.redirect('/proposals');
        });
    } else {
        db.query('SELECT p.*, COUNT(v.ProposalId) AS TotalVotes FROM Proposals p LEFT JOIN ProposalVotes v ON p.ProposalId = v.ProposalId GROUP BY p.ProposalId', (error, results) => {
            if (error) {
                return res.status(500).send({ message: 'Error fetching proposals' });
            }

            // Render the proposals.ejs view with the fetched data
            return res.render('proposals', { proposals: results });
        });
    }
};

const voteProposal = (req, res) => {
    const userId = req.user.id;
    const proposalId = req.body.proposalId;
    console.log('Pro vote called');
    // Check if the user has already voted for this proposal
    db.query('SELECT * FROM ProposalVotes WHERE UserId = ? AND ProposalId = ?', [userId, proposalId], (error, results) => {
        if (error) {
            return res.status(500).send({ message: 'Error checking existing vote' });
        }

        if (results.length > 0) {
            return res.status(400).send({ message: 'User has already voted for this proposal' });
        }

        // If the user hasn't voted yet, insert their vote into the database
        db.query('INSERT INTO ProposalVotes (UserId, ProposalId) VALUES (?, ?)', [userId, proposalId], (error, result) => {
            if (error) {
                return res.status(500).send({ message: 'Error adding vote' });
            }

            db.query('SELECT p.*, COUNT(v.ProposalId) AS TotalVotes FROM Proposals p LEFT JOIN ProposalVotes v ON p.ProposalId = v.ProposalId GROUP BY p.ProposalId', (error, results1) => {
                if (error) {
                    return res.status(500).send({ message: 'Error fetching proposals' });
                }
    
                return res.render('proposals', { proposals: results1 });
            });
        });
    });
};



module.exports = {
    getProfile,
    logout,
    getVolunteer,
    postVolunteer,
    getMenu,
    addDinnerItem,
    dinnerVote,
    getProposals,
    voteProposal
}