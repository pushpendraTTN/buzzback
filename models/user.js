const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    designation: {
        type: String
    },
    myWebsite: {
        type: String
    },
    gender: {
        type: String
    },
    DOB: {
        type: Date
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    zipCode: {
        type: Number
    },
    email:{
        type: String,
    },
    profilePic: {
        type: String,
    },
    role: {
        type: String,
        default: "developer"
    },
    friends: [
        {
            type: ObjectId,
            ref: "User"
        }
    ],
    requested: [
        {
            type: ObjectId,
            ref: "User"
        }
    ],
    received: [
        {
            type: ObjectId,
            ref: "User"
        }
    ]
});

module.exports = mongoose.model('User', userSchema);