const Customer = require('../models/account')
const Orders = require('../models/order')
const CustShopMapping = require('../models/custShopMapping')
const OrderUsersTempMapping = require('../models/orderUsersTempMapping')

const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const getLatLong = require('../lib/geocoding')
const {getNearbyShops, getNearbyActiveCustomersByShop} = require('../lib/nearbyPoints')
const Errors = require('../lib/errors')
const {getRemainingDuration} = require('../lib/utility')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

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

// signup a user - delivery_optout, payment_method
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

const getActiveUsers = async (req, res) => {

    const order_id = req.params.order_id
    const orderDetails = await Orders.findById(order_id)
    // Don't return any customer list if the order_creation_date is more than 10 minutes from now.
    // If order was created past 10 mins, don't show any active users
    const remaining = getRemainingDuration(orderDetails.createdAt, 1000, 0)
    if (remaining['mins'] === 0 && remaining['secs'] === 0) {
        // await OrderUsersTempMapping.deleteMany({original_cust_order_id: order_id})
        res.status(200).json([])
        return
    }
    // Find all users at the given shop with order_status = 'order_placed' && cust_id != current user id
    // Also ensure already rejected users are not displayed in the list anymore.
    let reject_cust_ids = await OrderUsersTempMapping.find({original_cust_order_id: order_id, status:'rejected'})
    reject_cust_ids = reject_cust_ids.map(o=>o.delivery_cust_id)
    const cust_id = req.user._id
    const cust_orders = await Orders.find({
        cust_id:  {$nin: [cust_id].concat(reject_cust_ids)},
        order_status: 'order_placed',
        shop_id: orderDetails.shop_id
    })
    // Filtering customers within 1000m radius
    const active_orders = await getNearbyActiveCustomersByShop(cust_orders,
        [orderDetails.cust_lat, orderDetails.cust_long])
    let active_users = []
    if(active_orders.length > 0){
        // Filtering duplicate customer records because one customer could have placed multiple orders.
        let seen = new Set()
        active_orders.forEach(o => {
            if(!seen.has(o.customer_id)){
                seen.add(o.customer_id)
                active_users.push({'original_cust_id': cust_id,
                    'status': 'new', 'delivery_cust_id': o.customer_id,
                'delivery_cust_name': o.customer_name, 'dist': o.dist,
                'original_cust_order_id': order_id})
            }
        })
        await OrderUsersTempMapping.insertMany(active_users)
    }
    res.status(200).json(active_users)
}

const UserPickupStatus = async (req, res) => {
    const customer_id = req.params.user_id
    console.log("Customer ID " + customer_id)
    await new Promise(resolve => setTimeout(resolve, 5000));

    const user_status = {"customer_id": customer_id, "status": "rejected", "customer_name": "John Doe"}
    res.status(200).json(user_status)
}


module.exports = {
    signupUser, loginUser, updateAccount, getAccount,
    getActiveUsers, UserPickupStatus
}