const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const shopSchema = new Schema({
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
  openHours: [{type: String, required: type}],
  openDays: [{type: String, required: type}],
  holidays: [Date]
})

// static signup method
shopSchema.statics.signup = async function(email, password, name, phone, unitNumber, streetAddress, 
  city, state, zipcode, openHours, openDays, coordinates) {

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

  const shop = await this.create({ email, password: hash, name, phone, unitNumber, streetAddress, city, state, 
    zipcode, openHours, openDays, ...coordinates, "holidays": []})

  return shop
}

// static login method
shopSchema.statics.login = async function(email, password) {

  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  const shop = await this.findOne({ email })
  if (!user) {
    throw Error('Incorrect email')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw Error('Incorrect password')
  }

  return shop
}

module.exports = mongoose.model('Shop', shopSchema)