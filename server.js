const express = require('express');
const mongoose = require('./config/dbConnection');
const authroute = require('./routes/auth');
const postroute = require('./routes/post');
const profileroute = require('./routes/profile');
const suggestionroute = require('./routes/suggestions');
const requestroute = require('./routes/request');
const notificationroute = require('./routes/notification');
const contacts = require('./routes/contact');
const report = require('./routes/report');
const moderator = require('./routes/Admin/Moderator');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const passport = require('passport');
require('./auth/googleauth')(passport);
const { secret } = require('./config/gauthConfig');
const { json } = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.port || 8000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(cors());


app.use(express.json());
app.use(cookieParser());

//routes
app.use(authroute);
app.use(postroute);
app.use(profileroute);
app.use(suggestionroute);
app.use(requestroute);
app.use(notificationroute);
app.use(contacts);
app.use(report);
app.use(moderator);

app.use(passport.initialize());
app.use(passport.session());

app.get('/google',(req,res,next)=>{
    next();
}, passport.authenticate('google', { session:false, scope: ['profile', 'email',] }));

app.get('/auth/google/callback',passport.authenticate('google',
{
    session: false,
}
),(req,res,next)=>{
    const token = jwt.sign({_id: req.user._id},secret);
    res.cookie('token',token);
    res.redirect('http://localhost:3000/feed');
    next();
});

app.listen(port, ()=>{
    console.log(`server is up and running at port ${port}`);
});
