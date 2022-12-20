const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Orders = require('../models/order')

const orderStatusMapping = (s) => {
    const m = {
        'order_placed': 'Order Placed', 'order_picked-up': 'Order Complete - Picked Up',
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
            "cust_name": pendingOrders[i].cust_name,
            "cust_phone": pendingOrders[i].cust_phone,
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
const getShopOrders = async (req, res) => {
    let orders = {
        "pending": [],
        "completed": []
    }
    const pendingOrders = await Orders.find({shop_id: req.user._id, order_status: 'order_placed'})
    orders["pending"] = getOrderDict(pendingOrders);
    const completedOrders = await Orders.find({shop_id: req.user._id, order_status: {$ne: 'order_placed'}})
    orders["completed"] = getOrderDict(completedOrders);
    res.status(200).json(orders)
}

// COMPLETED
const getShopOrderDetails = async (req, res) => {

    const order_id = req.params.id
    let order_data = await Orders.findById(order_id)
    if(order_data){
        const order_summary = JSON.parse(order_data.order_summary)
        order_data = getOrderDict([order_data])[0]
        order_data = {...order_data, "order_summary": order_summary}
    }
    res.status(200).json(order_data)
}

const updateShopOrderStatus = async (req, res) => {

    const order_data = await Orders.findById(req.body.order_id)

    if(order_data.order_delivery_type === "self"){
        await Orders.findByIdAndUpdate(order_data._id, {order_status: 'order_complete'})
    }
    else{
        await Orders.findByIdAndUpdate(order_data._id, {order_status: 'order_picked-up'})
    }

    // TODO: Send SMS
    res.status(200).json(req.body)

}

module.exports = {getShopOrders, getShopOrderDetails, updateShopOrderStatus}