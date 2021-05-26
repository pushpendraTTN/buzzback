const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/verifyuser');
const Post = require('../models/post');

router.put('/report',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate({_id:req.body.id},{ $inc: { reportCount: +1} })
    .then(data=>{
        res.json({report:data.reportCount});
    })
})

module.exports = router;