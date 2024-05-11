const express = require('express');
const router = express.Router();
// const { validationResult } = require('express-validator');
const db = require('../config/dbConnection');
// const jwt = require('jsonwebtoken');
// const { JWT_SECRET } = process.env;


const getProfile = (req, res) => {

    // const authToken = req.cookies.token;
    // const decode = jwt.verify(authToken, JWT_SECRET);
    db.query('SELECT * FROM Users WHERE UserId = ?', req.user.id, function(error, result, fields) {
        if (error) throw error;

        if (result.length === 0) {
            return res.status(404).send({ message: 'User not found' });
        }

        // return res.status(200).send({ success:true, data: result[0], message: 'Fetch Successful' });
        // console.log('Im retunring control')
        const userData = result[0];

        return res.render('./profile', { data: userData });
        
    });
}

const logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
}



module.exports = {
    getProfile,
    logout
}