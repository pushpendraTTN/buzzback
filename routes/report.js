const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/verifyuser');
const Post = require('../models/post');

router.put('/report',requireLogin,(req,res)=>{
    Post.findById(req.body.id)
    .then((post)=>{
        if(!post){
            return res.status(404).json({message: 'Post not found.'});
        }
        const report = [...post.report];
        const foundUser = report.find((user)=>user.toString()==req.user._id);
        if(foundUser !== undefined){
            return res.status(403).json({
                message: 'Forbidden',
                details: ['User has already Report the post.']
            })
        }
        Post.findByIdAndUpdate(req.body.id,{
            $push:{report:req.user._id},
            $set:{reportCount:report.length}
        },{
            new:true
        })
        .populate("postedBy","_id name profilePic")
        .populate("comments.postedBy","_id name profilePic")
        .exec((err,result)=>{
            if(err){
                return res.status(422).json({error: err})
            }
            else{
                res.json(result);
            }
        });
    })
});


module.exports = router;