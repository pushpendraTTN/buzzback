const mongoose = require('mongoose');
const url = require('../config/mongoUrl');

mongoose.connect(url,{
    useNewUrlParser: "true",
    useUnifiedTopology: "true"
},(err)=>{
    if(err){
        console.log("connection Error in DB",err);
    }
    else{
        console.log("MongoDB is Connected....");
    }
});

module.exports = mongoose;