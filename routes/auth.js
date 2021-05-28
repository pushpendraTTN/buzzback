const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/verifyuser');
const User = require('../models/user');

const app = express();


router.get('/protected',requireLogin,(req,res)=>{
    res.send("hello from protected route");
});

router.get('/userdetails',requireLogin,(req,res)=>{
    console.log(req.user);
    const userdata = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        pic: req.user.profilePic,
        friends: req.user.friends.length,
        website: req.user.myWebsite,
        designation: req.user.designation,
        role: req.user.role
    }
    res.json(userdata);
})

router.post('/viewuserdetails',requireLogin,(req,res)=>{
    User.find({_id:req.body.userid}).then(data=>{
        res.json({data});  
    })
})
module.exports = router;