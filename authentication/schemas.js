// This file contains schemas for notes and users using ZOD library

const z = require("zod")

// schema for note
const createSchema = z.object({
    title: z.string(),
    description: z.string(),
    color: z.string()
})

// schema for removing note
const completedSchema = z.object({
    id: z.string()
   
})

// schema for user
const userSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(5)
})

module.exports = { createSchema, completedSchema, userSchema }