const Customer = require('../models/account')
const Orders = require('../models/order')
const OrderUsersTempMapping = require('../models/orderUsersTempMapping')

const {getFormattedAddress, getRandomID, getNewDeadLineDateFromNow, getRemainingDuration} = require("../lib/utility");
const mongoose = require("mongoose");
const {createActiveUserEntries} = require("../lib/activeUsers");
const {sendShopSMS} = require("../lib/sms");

// COMPLETED
const createOrder = async (req, res) => {
    const user_id = req.user._id
    const confirmationID = await getRandomID();
    const cust_info = await Customer.findById(user_id)
    const cust_address = await getFormattedAddress(cust_info.streetAddress, cust_info.unitNumber, cust_info.city,
        cust_info.state, cust_info.zipcode)
    const order_details = await Orders.create_order(cust_info, cust_address, req.body.shop_info, confirmationID,
        {
            order_summary: req.body.order_summary, order_total: req.body.order_total, order_status: 'order_placed',
            delivery_type: 'self'
        })
    await createActiveUserEntries(order_details.orderID, user_id, mongoose.Types.ObjectId(req.body.shop_info.shop_id),
        cust_info.lat, cust_info.long)
    sendShopSMS(req.body.shop_info.phone, "Hello! You've received a new order. Please log into ChowPool website and goto Orders page for details.")
    res.status(200).json(order_details)
}

const orderStatusMapping = (s) => {
    const m = {
        'order_placed': 'Order Placed', 'order_picked-up': 'Order Picked-Up',
        'order_complete': 'Order Complete'
    }
    return m[s]
}

function getOrderDict(pendingOrders) {
    let orders = []
    for (let i in pendingOrders) {
        const o = {
            "order_id": pendingOrders[i]._id,
            "order_status": orderStatusMapping(pendingOrders[i].order_status),
            "shop_name": pendingOrders[i].shop_name,
            "order_total": pendingOrders[i].order_total,
        }
        if (pendingOrders[i].order_delivery_type !== 'self') {
            o["delivery_name"] = pendingOrders[i].delivering_cust_name
            o["delivery_phone"] = pendingOrders[i].delivering_cust_phone
        }
        orders.push(o)
    }
    return orders
}

// COMPLETED
const getOrders = async (req, res) => {
    let orders = {
        "pending": [],
        "completed": []
    }
    const pendingOrders = await Orders.find({cust_id: req.user._id, order_status: {$ne: 'order_complete'}})
    orders["pending"] = getOrderDict(pendingOrders);
    const completedOrders = await Orders.find({cust_id: req.user._id, order_status: 'order_complete'})
    orders["completed"] = getOrderDict(completedOrders);
    res.status(200).json(orders)
}

// COMPLETED
const getOrderDetails = async (req, res) => {

    //orderConfirmationID should be same as orderID
    const order_id = req.params.id
    let order_data = await Orders.findById(order_id)
    if(order_data){
        const order_summary = JSON.parse(order_data.order_summary)
        order_data = getOrderDict([order_data])[0]
        order_data = {...order_data, "order_summary": order_summary}
    }
    res.status(200).json(order_data)
}

// COMPLETED
const getPendingDeliveries = async (req, res) => {
    // Orders table -> delivery_customer_id = req.user._id + order_status != order_complete
    const orders = await Orders.find({delivering_cust_id: req.user._id, order_status: {$ne: 'order_complete'}})

    const getDistance = async (o) => {
        console.log("O", o)
        const orderMap = await OrderUsersTempMapping.findOne({
            original_cust_order_id: o._id,
            delivery_cust_id: req.user._id
        })
        return orderMap.dist
    }
    let pendingDeliveries = []
    for (idx in orders) {
        pendingDeliveries.push({
            order_confirmation_id: orders[idx].order_confirmation_id,
            customer_name: orders[idx].cust_name,
            customer_phone: orders[idx].cust_phone,
            customer_address: orders[idx].cust_address,
            distance: await getDistance(orders[idx]),
            shop_name: orders[idx].shop_name,
            shop_address: orders[idx].shop_address
        })
    }

    res.status(200).json(pendingDeliveries)
}

// COMPLETED
const updateOrderStatus = async (req, res) => {
    // body contains order_confirmation_id
    // update order_status to order_complete.
    await Orders.findOneAndUpdate({order_confirmation_id: req.body.order_confirmation_id},
        {order_status: 'order_complete'})
    // TODO: Send SMS
    res.status(200).json(req.body)
}

// COMPLETED
const getPendingRequests = async (req, res) => {
    // customer_name, order_confirmation_id, remaining_time.mins, remaining_time.secs, distance, shop_name, shop_address
    //"time_remaining": { // All pending deliveries this key should be available
    //                     ...getRemainingDuration(Date.parse(Date()) - (60 * 1000), 2, 30)
    //                 },
    const orders = await OrderUsersTempMapping.find({
        delivery_cust_id: req.user._id,
        requested_date: {$gte: getNewDeadLineDateFromNow(150)},
        status: 'pending'
    })
    const getOrderData = async (ord) => {
        const o = await Orders.findById(ord.original_cust_order_id)
        return {
            order_confirmation_id: o.order_confirmation_id,
            customer_name: o.cust_name,
            customer_phone: o.cust_phone,
            customer_address: o.cust_address,
            shop_name: o.shop_name,
            shop_address: o.shop_address,
            distance: ord.dist,
            time_remaining: getRemainingDuration(ord.requested_date, 2, 30)
        }
    }

    let pendingRequests = []
    for (let idx in orders) {
        pendingRequests.push(await getOrderData(orders[idx]))
    }
    console.log("pendingReq", pendingRequests)
    res.status(200).json(pendingRequests)

}

// COMPLETED
const updateDeliveryRequestAck = async (req, res) => {
    // body contains order_confirmation_id, status
    // Update temp table status
    const ord = await Orders.findOne({order_confirmation_id: req.body.order_confirmation_id})
    await OrderUsersTempMapping.findOneAndUpdate({
        original_cust_order_id: ord._id,
        delivery_cust_id: req.user._id
    }, {'status': req.body.status})
    if (req.body.status === "accepted") {
        const customer = await Customer.findById(req.user._id)
        await Orders.findByIdAndUpdate(ord._id, {

            order_delivery_type: "non_self",
            delivering_cust_id: customer._id,
            delivering_cust_name: customer.name,
            delivering_cust_phone: customer.phone,
            delivering_cust_address: await getFormattedAddress(customer.streetAddress, customer.unitNumber,
                customer.city, customer.state, customer.zipcode)
        })
    }
    // TODO: send SMS with apt message for both accept and reject
    res.status(200).json(req.body)
}

module.exports = {
    getOrders, getOrderDetails, createOrder, updateOrderStatus, getPendingRequests, getPendingDeliveries,
    updateDeliveryRequestAck
}