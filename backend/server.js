require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")

const userAuthRoutes = require('./routes/user_auth')
const customerRoutes = require('./routes/customer')
const shopRoutes = require('./routes/shop')

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
app.use('/api/', userAuthRoutes)
app.use('/api/', customerRoutes)
app.use('/api/', shopRoutes)


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