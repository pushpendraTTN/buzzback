const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    body:{
        type: String
    },
    photo:{
        type: String
    },
    reportCount:{
        type: Number 
    },
    likes: [
        {
            type: ObjectId,
            ref: "User"
        }
    ],
    dislikes: [
        {
            type: ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            text: String,
            postedBy: {
                type: ObjectId,
                ref: "User"
            }
        }
    ],
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    createdAt:{
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('Post', postSchema);