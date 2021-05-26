const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/verifyuser');
const User = require('../models/user');

router.get('/notifications',requireLogin,(req,res)=>{
    User.findOne({_id:req.user._id},{received:1,_id:0}).populate("received","_id name profilePic")
    .then(result=>{
        console.log(result);
        res.json({result});
    })
})

module.exports = router;