const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const { secret } = require('../config/gauthConfig');

module.exports = (req,res,next)=>{
    console.log(req.headers.authorization);
    const { authorization } = req.headers;
    //console.log(req.headers);
    if(authorization=='Bearer undefined'){
    console.log("reached");
        res.status(401).json({error:" IN Error You must logged in"});
        // return res.redirect('http://localhost:3000/login');

    }
    const token = authorization.replace("Bearer ","");

    jwt.verify(token,secret,(err,payload)=>{
        if(err){
            // return res.status(401).json({error: " In verify You must logged In"});
        // res.redirect('http://localhost:3000/');

        }
        const id = payload._id;
        if(!payload?._id){
            res.redirect('http://localhost:3000');
        }
        User.findById(id).then(userdata=>{
            req.user = userdata;
            next();
        });
        
    });
}