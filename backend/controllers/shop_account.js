const Shop = require('../models/shop')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const getLatLong = require('../lib/geocoding')
const Errors = require('../lib/errors')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

// login a user
const loginShopUser = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await Shop.login(email, password)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({email, token})
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error.message})
    }
}

const signupShopUser = async (req, res) => {
    const {
        email,
        password,
        name,
        phone,
        unitNumber,
        streetAddress,
        city,
        state,
        zipcode,
        startTime, endTime,
        openDays
    } = req.body
    try {
        const coordinates = await getLatLong(streetAddress, city, state, zipcode)

        if (coordinates === undefined) {
            const err_msg = Errors.getErrorMessage('invalid_address')
            res.status(err_msg.status).json({error: err_msg.message})
        } else {
            const user = await Shop.signup(email, password, name, phone, unitNumber, streetAddress, city, state, zipcode, startTime, endTime, openDays, coordinates)

            // create a token
            const token = createToken(user._id)

            res.status(200).json({email, token})
        }
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {signupShopUser, loginShopUser}
