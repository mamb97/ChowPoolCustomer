require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")

const custAuthRoutes = require('./routes/customer_auth')
const customerRoutes = require('./routes/customer')

// express app
const app = express()

// middleware
app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/', custAuthRoutes)
app.use('/api/', customerRoutes)


// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })