const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const customerSchema = new Schema({
  name: {type: String, required: true},
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  city: {type: String, required: true},
  streetAddress: {type: String, required: true},
  unitNumber: String,
  state: String,
  zipcode: {type: String, required: true},
  lat: {type: Number, required: true},
  long: {type: Number, required: true},
  phone: {
    type: String,
    required: true
  },
  'delivery_optout': {
    type: Boolean,
    default: false
  }, 
  'payment_method': {
    type: String,
    default: 'Credit Card'
  }

})

// static signup method
customerSchema.statics.signup = async function(email, password, name, phone, unitNumber, streetAddress, 
  city, state, zipcode, coordinates) {

  // validation
  if (!email || !password) {
    throw Error('All fields must be filled')
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid')
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough')
  }

  const exists = await this.findOne({ email })

  if (exists) {
    throw Error('Email already in use')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const customer = await this.create({ email, password: hash, name, phone, 
    unitNumber, streetAddress, city, state, zipcode, ...coordinates})

  return customer
}

// static login method
customerSchema.statics.login = async function(email, password) {

  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  const customer = await this.findOne({ email })
 
  if (!customer) {
    throw Error('Incorrect email')
  }

  const match = await bcrypt.compare(password, customer.password)
  if (!match) {
    throw Error('Incorrect password')
  }

  return customer
}

customerSchema.statics.getAccount = async function(customer_id) {
  return await this.findOne({ _id: customer_id })
}
module.exports = mongoose.model('Customer', customerSchema)