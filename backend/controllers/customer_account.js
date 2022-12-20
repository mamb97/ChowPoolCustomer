const Customer = require('../models/account')
const Orders = require('../models/order')
const CustShopMapping = require('../models/custShopMapping')
const OrderUsersTempMapping = require('../models/orderUsersTempMapping')

const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const getLatLong = require('../lib/geocoding')
const {getNearbyShops} = require('../lib/nearbyPoints')
const Errors = require('../lib/errors')
const {isTimeOverLimit} = require('../lib/utility')
const {isOrderNew, updateActiveUserEntries} = require("../lib/activeUsers");
const {sendSMSMessage} = require("./notification_handler");
const {sendCustomerSMS} = require("../lib/sms");

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

//COMPLETED
const addShopEntries = async (user_id, coordinates, delete_all = false) => {
    const shopData = await getNearbyShops(user_id, coordinates)
    if (!shopData)
        return
    if (delete_all) {
        console.log("Deleting Shop Data...")
        await CustShopMapping.deleteMany({cust_id: user_id})
    }
    console.log("Inserting Shop Data...")
    await CustShopMapping.insertMany(shopData)
    console.log(shopData)
}

//COMPLETED
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

//COMPLETED
const signupUser = async (req, res) => {
    const {email, password, name, phone, unitNumber, streetAddress, city, state, zipcode, delivery_opt_out} = req.body
    try {
        const coordinates = await getLatLong(streetAddress, city, state, zipcode)

        if (coordinates === undefined) {
            const err_msg = Errors.getErrorMessage('invalid_address')
            res.status(err_msg.status).json({error: err_msg.message})
        } else {
            const user = await Customer.signup(email, password, name, phone, unitNumber, streetAddress,
                city, state, zipcode, coordinates)

            // create a token
            const token = createToken(user._id)

            addShopEntries(user._id, coordinates)

            res.status(200).json({email, token})
        }
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//COMPLETED
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

//COMPLETED
const updateAccount = async (req, res) => {
    console.log(req.user._id, req.body)
    const {id} = req.user._id

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No valid customer'})
    }
    const coordinates = await getLatLong(req.body.streetAddress, req.body.city, req.body.state, req.body.zipcode)
    if (coordinates === undefined) {
        const err_msg = Errors.getErrorMessage('invalid_address')
        res.status(err_msg.status).json({error: err_msg.message})
        return
    }

    const cust = await Customer.findOneAndUpdate(req.user._id, {
        ...req.body
    })

    if (!cust) {
        res.status(400).json({error: 'No valid customer'})
    } else {
        addShopEntries(req.user._id, coordinates, true)
        res.status(200).json(req.body)
    }
}

//COMPLETED
const getActiveUsers = async (req, res) => {
    const order_id = req.params.order_id
    const orderDetails = await isOrderNew(order_id);
    if(orderDetails) {
        const active_users = await OrderUsersTempMapping.find({original_cust_order_id: order_id,
            'status': 'new'})
        res.status(200).json(active_users)
    }
    else {
        res.status(200).json([])
    }
}

const sendRequest = async (req, res) => {
    const requested_date = new Date()
    let user_data = await OrderUsersTempMapping.findOneAndUpdate(
        {original_cust_order_id: req.body.original_cust_order_id, delivery_cust_id: req.body.delivery_cust_id},
        {'status': 'pending', 'requested_date': requested_date}, {returnOriginal: false})

    sendCustomerSMS(req.body.delivery_cust_id, "Hello! Would like to pickup another user's order? " +
        "If yes, please onto ChowPool website and accept the request. For every successful delivery, you'll receive $1.00")

    async function waitingForConfirmation() {
        while (user_data.status === "pending") {
            if (isTimeOverLimit(requested_date, 150)) {
                user_data = await OrderUsersTempMapping.findOneAndUpdate({
                    original_cust_order_id: req.body.original_cust_order_id,
                    delivery_cust_id: req.body.delivery_cust_id
                }, {'status': "rejected"}, {returnOriginal: false})
            } else {
                user_data = await OrderUsersTempMapping.findOne({
                    original_cust_order_id: user_data.original_cust_order_id,
                    delivery_cust_id: user_data.delivery_cust_id
                })
            }
        }
    }
    await waitingForConfirmation();
    if(user_data['status'] === "rejected"){
        const orderInfo = await Orders.findById(req.body.original_cust_order_id)
        await updateActiveUserEntries(orderInfo._id, orderInfo.cust_id, orderInfo.shop_id, orderInfo.cust_lat, orderInfo.cust_long)
    }
    res.status(200).json(user_data)
}

module.exports = {signupUser, loginUser, updateAccount, getAccount, getActiveUsers, sendRequest}