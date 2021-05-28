const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../../middleware/verifyuser');
const Post = require('../../models/post');

router.delete('/admin/deletepost',requireLogin,(req,res)=>{
    Post.findOne({_id:req.body.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:"can not delete "+err});
        }
        if(post){
            post.remove()
            .then(result=>{
                res.json({result});
            }).catch(err=>{
                console.log(err);
            })
        }
    });
});

router.get('/admin/viewallpost',requireLogin,(req,res)=>{
    Post.find({ reportCount: { $gt: 4 } }).sort({createdAt : -1})
    .populate("postedBy","_id name profilePic")
    .populate("comments.postedBy","_id name profilePic")
    .then(posts=>{
        res.json({posts});
    })
    .catch(err=>{
        console.log(err);
    })
});

module.exports = router;