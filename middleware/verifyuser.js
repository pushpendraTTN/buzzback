const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const { secret } = require('../config/gauthConfig');

module.exports = (req,res,next)=>{
    const { authorization } = req.headers;
    if(authorization=='Bearer undefined'){
        res.status(401).json({error:" IN Error You must logged in"});
    }
    const token = authorization.replace("Bearer ","");

    jwt.verify(token,secret,(err,payload)=>{
        if(err){
            return res.status(401).json({error: " In verify You must logged In"});
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