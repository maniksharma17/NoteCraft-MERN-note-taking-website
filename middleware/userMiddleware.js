// Middleware for verifying JWT token

const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');
dotenv.config();
const jsonKey = process.env.JWTKEY


function userMiddleware(req, res, next){
    const token = req.headers.authorization
    
    try {
        const verifyToken = jwt.verify(token, jsonKey)
        if (verifyToken){
            next()
        }
    } catch(e){
        res.json({error: "Invalid token"})
    }
    
    
}

module.exports = { userMiddleware }