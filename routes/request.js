const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/verifyuser');
const User = require('../models/user');
ObjectId = require('mongodb').ObjectID;

router.post
('/request',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $push:{requested:req.body.id}
    },{
        new:true
    })
    .exec((err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(result);
        }
    })
    User.findByIdAndUpdate(req.body.id,{
        $push:{received:req.user._id}
    },{
        new:true
    })
    .exec((err,result)=>{
        if(err){
            console.log(err);
        }
        res.json({sucess:"sucess"});
    })
});

router.put('/accept',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $push:{friends: req.body.id},
        $pull:{received: req.body.id}
    },{
        new:true
    })
    .exec((err,result)=>{
        if(err)
        {
            console.log(err);
        }
    })
    User.findByIdAndUpdate(req.body.id,{
        $push:{friends: req.user._id},
        $pull:{requested: req.user._id}
    },{
        new:true
    })
    .exec((err,result)=>{
        if(err)
        {
            console.log(err);
        }
        res.status(200).json({sucess:"Sucessfully Accepted"});
    })
})

module.exports = router;