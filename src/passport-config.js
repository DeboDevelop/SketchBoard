const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/users');

function initialize(passport) {
    //Authentication User
    const authenticateUser = async (email, password, done) => {
        let user;
        //Finding the User
        try {
            user = await getUserbyEmail(email)
        } catch (e) {
            console.log(e)
        }
        //If User is not found
        if(user == null){
            return done(null, false, { message: 'No user with that Email' });
        }
        
        //Comparing Password
        try {
            if( await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (e) {
            return done(e)
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

    passport.serializeUser((user, done) => done(null,user.id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserbyId(id))
    });
}

//Function to find user by email
async function getUserbyEmail(email)
{
    let user; 
    await User.findOne( {email}, (err, item)=>{
        if(err)
        {
            console.log(err)
        }
        else {
            user = item;
        }
    });
    return new Promise((resolve, reject) => {
        if(user) {
            resolve(user)
        } else {
            reject({ message: "Something Wrong happend Here"})
        }
    })
}

//Function to find user by id 
async function getUserbyId(id) {
    let user;
    await User.findById(id, (err, item)=>{
        if(err)
        {
            console.log(err)
        }
        else {
            user = item;
        }
    });
    return new Promise((resolve, reject) => {
        if(user) {
            resolve(user)
        } else {
            reject({ message: "Something Wrong happend Here"})
        }
    })
}

module.exports = initialize;