// Base file

const express = require("express")
const dotenv = require('dotenv');
dotenv.config();

const { router } = require("./routes/index") 
const PORT = process.env.PORT || 3000
console.log(PORT)
const app = express()

app.use(express.json())

app.use("/", router)

app.listen(PORT)