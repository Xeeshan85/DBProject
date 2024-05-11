const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRouter = require('./Routes/userRoutes');
// const userController = require('./Controllers/userController');
require('./config/dbConnection');

const app = express();
const port = 8090;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Middleware
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message: err.message,
    });
});

// Routes
app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

// app.get('/home', (req, res) => {
//     res.render('home');
// });

// app.get('/home', userController.getUser, userController.getUser);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);    
});
