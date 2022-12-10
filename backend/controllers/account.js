const Customer = require('../models/account')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// login a user
const loginUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await Customer.login(email, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({email, token})
  } catch (error) {
    console.log(error)
    res.status(400).json({error: error.message})
  }
}

// signup a user
const signupUser = async (req, res) => {
  const {email, password, name, phone, unitNumber, houseNumber, street, city, state, zipcode} = req.body

  try {
    const user = await Customer.signup(email, password, name, phone, unitNumber, houseNumber, street, city, state, zipcode)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// get user account
const getAccount = async (req, res) => {
  
  const user_id = req.user._id

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(404).json({error: 'No such customer'})
  }

  const cust = await Customer.findById(user_id)

  if (!cust) {
    return res.status(404).json({error: 'No such customer'})
  }
  
  res.status(200).json(cust)
}

const updateAccount = async (req, res) => {
  console.log(req.user._id, req.body)
  const { id } = req.user._id

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No valid customer'})
  }

  const cust = await Customer.findOneAndUpdate(req.user._id, {
    ...req.body
  })

  if (!cust) {
    return res.status(400).json({error: 'No valid customer'})
  }
  
  res.status(200).json(req.body)
}

const getActiveUsers = async(req, res) => {

  activeUsers = {'active_users': ['a', 'b', 'c', 'd']}
  res.status(200).json(activeUsers)
}

module.exports = { signupUser, loginUser, updateAccount, getAccount,
getActiveUsers }