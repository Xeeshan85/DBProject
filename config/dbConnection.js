const {DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE} = process.env;
const mysql = require('mysql');


const dbConnection = mysql.createConnection({
    host: DATABASE_HOST,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE
});

dbConnection.connect( (err) => {
    if (err) throw err;
    console.log('Database Connected....');
});

module.exports = dbConnection;