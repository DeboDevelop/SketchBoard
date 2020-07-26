//Adding environment variable
if( process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
//Adding required packages
const http = require('http');
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const socketio = require('socket.io');

//To handle unhandledRejection of promise
process.on('unhandledRejection', (reason, p) => { throw reason });

//Intialize Express
const app = express();
//Creating Server
const server = http.createServer(app);
//Initializing Socketio
const io = socketio(server);

//Importing required files
const initializePassport = require('./passport-config');
const User = require('./models/users');

//Static files
app.use(express.static('static'))

//Initialize Passport
initializePassport(passport);

//Connecting to Database
mongoose.connect( process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true } );
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

//Binding ejs, flash, express-session, passport to app object
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

}));
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//Route for homepage
app.get('/', checkNotAuthenticated, (req, res) => {
    res.render('index.ejs');
});

//Route for Dashboard
app.get('/dashboard', checkAuthenticated, (req, res) => {
    res.render('dashboard.ejs', { name: req.user.name });
});

//Route for Login Page
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
});

//Route for Login - POST
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: 'login',
    failureFlash: true
}));

//Route for Registration Page
app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
});

//Route for Registration - POST
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        //Checking if email exist
        let u = await getUserbyEmail(req.body.email);
        //If email doesn't exist then create user
        if(!u) {
            try {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                
                const user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword
                });
                await user.save()
                req.flash( 'success', 'Your account Has been Created ')
                res.redirect('/login')
            } catch {
                res.redirect('/register')
            }
        }
        // Else Show appropriate message through flash
        else {
            req.flash( 'error', 'Email already exist ')
            res.redirect('/register')
        }
    } catch(e) {
        console.log(e)
    }
});

//Route for logout
app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login')
})

//function to check if user is authenticated to prevent unauthenticated user from accessing dashboard 
function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

//function to check if user is authenticated to prevent unauthenticated user from accessing anything except dashboard
function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        res.redirect('/dashboard')
    } else {
        next()
    }
}

//Function to check if email is already registered
async function getUserbyEmail(email)
{
    return new Promise(async (resolve, reject) => {
        let user;
        //Checking if user exist or not
        await User.findOne( {email}, (err, item)=>{
            if(err)
            {
                //If any error occur then reject the promise
                reject({ message: "Something Wrong inside Promise in server.js"})
            }
            else {
                user = item;
            }
        });
        if(user) {
            //If user is found then resolve with user object
            resolve(user)
        } else {
            //If user is not found thn sent null
            console.log("User not found by email in server.js")
            resolve(null)
        }
    })
}

//port for listening
const PORT = process.env.PORT || 3000;

//Listening to port
server.listen(PORT, () => {
    console.log(`The Server is running in Port ${PORT}`);
})