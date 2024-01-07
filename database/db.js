// This file connects backend with database using mongoose 
const dotenv = require('dotenv');
dotenv.config();

const DATABASE = process.env.DATABASE

const mongoose = require("mongoose")

mongoose.connect(DATABASE)

// defining schema for documents
const noteSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    color: String
})

const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    noteList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note"
    }]
})

// creating models for collections
const Note = mongoose.model("Note", noteSchema)
const User = mongoose.model("User", userSchema)

module.exports = { Note, User }