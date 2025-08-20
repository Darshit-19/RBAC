const express = require('express')
require('dotenv').config()
const dbConnect = require('./config/dbConnect')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')

dbConnect()

const app = express()

//Middlware
app.use(express.json())

//Routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

//Start the server
const PORT = process.env.PORT || PORT
app.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`);
    
})