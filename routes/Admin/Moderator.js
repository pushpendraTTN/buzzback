const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../../middleware/verifyuser');
const Post = require('../../models/post');

router.delete('/admin/deletepost',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
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

module.exports = router;