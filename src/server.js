if( process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const app = express();

const initializePassport = require('./passport-config');
const User = require('./models/users');

initializePassport(passport);

mongoose.connect( process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true } );
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

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

app.get('/', checkNotAuthenticated, (req, res) => {
    res.render('index.ejs');
});

app.get('/dashboard', checkAuthenticated, (req, res) => {
    res.render('dashboard.ejs', { name: req.user.name });
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: 'login',
    failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        let u = await getUserbyEmail(req.body.email)
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
        else {
            req.flash( 'error', 'Email already exist ')
            res.redirect('/register')
        }
    } catch(e) {
        console.log("Not Hello")
        console.log(e)
    }
});

app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        res.redirect('/dashboard')
    } else {
        next()
    }
}

async function getUserbyEmail(email)
{
    return new Promise(async (resolve, reject) => {
        let user; 
        await User.findOne( {email}, (err, item)=>{
            if(err)
            {
                reject({ message: "Something Wrong inside Promise"})
            }
            else {
                user = item;
            }
        });
        if(user) {
            resolve(user)
        } else {
            resolve(null)
        }
    })
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`The Server is running in Port ${PORT}`);
})