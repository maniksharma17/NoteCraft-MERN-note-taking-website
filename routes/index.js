// Thie file contains all routes

const express = require("express")
const router = express.Router()

// required files
const { createSchema, completedSchema, userSchema } = require("../authentication/schemas")
const { userMiddleware } = require("../middleware/userMiddleware")
const { Note, User } = require("../database/db")

// required modules
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const mongodb = require("mongodb")
const dotenv = require('dotenv');
dotenv.config();
const cors = require("cors")

// JSON key
const jsonKey = process.env.JWTKEY

router.use(express.json())
router.use(cors())

// SIGNUP ROUTE
router.post("/signup", async (req, res)=>{
    const userPayload = req.body
    const parsedUser = userSchema.safeParse(userPayload)

    if (!parsedUser.success){
        res.json({message: "Enter Username / Password must be atleast 5 characters"})
        return
    }

    const existingUser = await User.findOne({
        username: userPayload.username
    })

    if (existingUser){
        res.json({message: "Username exists."})
    } else {
        User.create({
            username: userPayload.username,
            password: userPayload.password,
            
        }).then(()=>{
            res.json({message: "User created.", user: parsedUser})
        })
    }
})

// SIGNIN ROUTE
router.post("/signin", async (req, res)=>{
        const userPayload = req.body

        const existingUser = await User.findOne({
            username: userPayload.username,
            password: userPayload.password})

        if (existingUser == null){
            res.json({message: "Incorrect username / passoword", auth: false})
        } else {
            const token = jwt.sign({username: userPayload.username}, jsonKey)
            res.json({token: token, username: userPayload.username, message: "Logged in!"})
        }
})


// ROUTE FOR CREATING NOTE
router.post("/createNote", userMiddleware, (req, res)=>{
    const notePayLoad = req.body
    const username = req.headers.username

    const parsedNote = createSchema.safeParse(notePayLoad)

    if (!parsedNote.success){
        res.json({message: "Invalid data", error: parsedNote.error.issues[0].message})
        return
    }

    Note.create({
        title: notePayLoad.title,
        description: notePayLoad.description,
        color: notePayLoad.color
    }).then((response)=>{
        res.json({message: "Note created"})
     
        User.updateOne({username: username}, {
            "$push": {
                noteList: response._id
            }
        }).then()
    })
})


// ROUTE FOR REMOVING NOTE
router.put("/completeNote", userMiddleware, async (req, res)=>{
    const notePayLoad = req.body
    const username = req.headers.username
    const parsedNote = completedSchema.safeParse(notePayLoad)

    if (!parsedNote.success){
        res.json({message: "Invalid data", error: parsedNote.error})
        return
    }

    Note.deleteOne({_id: notePayLoad.id}).then(()=>{
        res.json({message: "Note removed"})
    })
    
    User.updateOne({username: username}, {
        "$pull": {
            noteList: notePayLoad.id  
        }
   }).then()

})

// ROUTE FOR SHOWING ALL NOTES OF A USER
router.get("/getNotes", userMiddleware, async (req, res)=>{

    const username = req.headers.username
    const user = await User.findOne({username: username})

    Note.find({
        _id : {
            "$in": user.noteList
        }
    })
    .then((Notes)=>{
        res.json({Notes})
    })
    .catch((e)=>{
        res.json({message: "No note"})
    })

})

module.exports = { router } 
