const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/verifyuser');
const User = require('../models/user');

 router.get('/user/suggestions',requireLogin, async(req,res)=>{
    var frds;
    var requested;
     await User.findOne({_id:req.user._id},{friends:1,_id:0})
    .then(data=>{
        frds=data;
    })
    await User.findOne({_id:req.user._id},{requested:1,_id:0})
    .then(data=>{
        requested = data;
    })
    const sub = frds.friends.concat(requested.requested);
    const main = sub.concat(req.user._id);
    const sugg = await User.find({_id: {  $nin: main}},{name: 1,profilePic:1})
    res.json({sugg});

});

module.exports = router;