const Shop = require('../models/shop')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const getLatLong = require('../lib/geocoding')
const Errors = require('../lib/errors')
const {getNearbyCustomers} = require("../lib/nearbyPoints");
const CustShopMapping = require("../models/custShopMapping");

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

// COMPLETED
const addCustEntries = async (shop_data, shop_id, coordinates, delete_all=false) => {
    const custData = await getNearbyCustomers(shop_data, shop_id, coordinates)
    if(!custData)
        return
    if(delete_all) {
        console.log("Deleting Shop Data...")
        await CustShopMapping.deleteMany({shop_id: shop_id})
    }
    console.log("Inserting Shop Data...")
    await CustShopMapping.insertMany(custData)
    console.log(custData)
}

// COMPLETED
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

// COMPLETED
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
            addCustEntries(req.body, user._id, coordinates)
            res.status(200).json({email, token})
        }
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// COMPLETED
const getShopAccount = async (req, res) => {
    const user_id = req.user._id

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
        return res.status(404).json({error: 'No such shop'})
    }

    const cust = await Shop.findById(user_id)

    if (!cust) {
        return res.status(404).json({error: 'No such shop'})
    }

    res.status(200).json(cust)
}

// COMPLETED
const updateShopAccount = async (req, res) => {
    const { id } = req.user._id

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No valid shop'})
    }
    const coordinates = await getLatLong(req.body.streetAddress, req.body.city, req.body.state, req.body.zipcode)
    if(coordinates === undefined){
        const err_msg = Errors.getErrorMessage('invalid_address')
        res.status(err_msg.status).json({error: err_msg.message})
        return
    }

    const cust = await Shop.findByIdAndUpdate(req.user._id, {
        ...req.body
    })

    if (!cust) {
        res.status(400).json({error: 'No valid shop'})
    }
    else {
        addCustEntries(req.body, req.user._id, coordinates, true)
        res.status(200).json(req.body)
    }
}

module.exports = {signupShopUser, loginShopUser, getShopAccount, updateShopAccount}
