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
        // console.log(data);
        frds=data;
    })
    await User.findOne({_id:req.user._id},{requested:1,_id:0})
    .then(data=>{
        requested = data;
    })
    // console.log(frds.friends);
    // console.log(requested);
    const sub = frds.friends.concat(requested.requested);
    // console.log(sub);
    const main = sub.concat(req.user._id);
    // console.log(main);
    const sugg = await User.find({_id: {  $nin: main}},{name: 1,profilePic:1})
    res.json({sugg});
    // console.log(sugg);

   


//     // const subMainArr = getUserFrds[0].friends.concat(
//     //     getUserRequested[0].requested
//     // );
//     // const mainArr = subMainArr.concat(req.user._id);
//     // const getSuggestionData = User.find(
//     //     {_id: {$nin: mainArr} },
//     //     {name: 1,profilePic:1}
//     // );
//     // console.log(getSuggestionData);
});

module.exports = router;