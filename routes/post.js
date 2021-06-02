const { urlencoded } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/verifyuser');
const Post = require('../models/post');
const User = require('../models/user');


router.post('/createpost',requireLogin,(req,res)=>{
    const {body,url} = req.body;
    if(!body){
        res.status(422).json({error: "Please add all fiels"});
    }
    //console.log(req.user);
    const post = new Post({
        body,
        photo:url,
        postedBy: req.user
    })
    post.save().then(result=>{
        res.json({post: result})
    })
    .catch(err=>{
        console.log(err);
    })
    
});

router.get('/viewallpost',requireLogin,(req,res)=>{
    Post.find().sort({$natural : -1})
    .populate("postedBy","_id name profilePic")
    .populate("comments.postedBy","_id name profilePic")
    .then(posts=>{
        res.json({posts});
    })
    .catch(err=>{
        console.log(err);
    })
});

router.get('/loadMorePost',requireLogin,(req,res)=>{
    Post.find().sort({$natural : -1}).limit(3).skip(3)
    .populate("postedBy","_id name profilePic")
    .populate("comments.postedBy","_id name profilePic")
    .then(posts=>{
        res.json({posts});
    })
    .catch(err=>{
        console.log(err);
    })
});

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name profilePic")
    .then(mypost=>{
        res.json({mypost});
    })
    .catch(err=>{
        console.log(err);
    })
});

router.put('/like',requireLogin,(req,res)=>{
    Post.findById(req.body.postId)
    .then((post)=>{
        if(!post){
            return res.status(404).json({message: 'Post not found.'});
        }
        const likes = [...post.likes];
        const foundUser = likes.find((user)=>user.toString()==req.user._id);
        if(foundUser !== undefined){
            return res.status(403).json({
                message: 'Forbidden',
                details: ['User has already liked the post.']
            })
        }
        Post.findByIdAndUpdate(req.body.postId,{
            $push:{likes:req.user._id},
            $pull:{dislikes:req.user._id}

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

router.put('/dislike',requireLogin,(req,res)=>{
    Post.findById(req.body.postId)
    .then((post)=>{
        if(!post){
            return res.status(404).json({message: 'Post not found.'});
        }
        const dislikes = [...post.dislikes];
        const foundUser = dislikes.find((user)=>user.toString()==req.user._id);
        if(foundUser !== undefined){
            return res.status(403).json({
                message: 'Forbidden',
                details: ['User has already disliked the post.']
            })
        }
        Post.findByIdAndUpdate(req.body.postId,{
            $pull:{likes:req.user._id},
            $push:{dislikes:req.user._id}
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



router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name profilePic")
    .populate("postedBy","_id name profilePic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result);
        }
    });
});

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    console.log('in delete post');
    console.log(req.params);
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:"can not delete "+err});
        }
        if(post.postedBy._id.toString()===req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json({result});
            }).catch(err=>{
                console.log(err);
            })
        }
    });
});

router.post('/contactPost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.body.contact_id})
    .populate("postedBy","_id name profilePic")
    .then(mypost=>{
        // console.log('mypost==>',mypost)
        res.json({mypost});
    })
    .catch(err=>{
        console.log(err);
    })
});

router.get('/getfeedPost',requireLogin,(req,res)=>{
    User.findById(req.user._id,(err,user)=>{
        if(err){
            return res.status(500).json({
                message: 'ERROR Occured'
            })
        }
    const frdsList = user.friends;
    frdsList.push(req.user._id);

    Post.find({postedBy: {$in: frdsList}}).sort({createdAt: -1}).limit(10)
    // .populate('postedBy')
    .populate("postedBy","_id name profilePic")
    .populate("comments.postedBy","_id name profilePic")
    .then((posts)=>{
        if(posts.length===0){
            return res.status(404).json({message:'No posts Found'})
        }
        return res.json({posts});
    })
    .catch(err=>{
        console.log(err);
    })
    })   
});

module.exports = router;