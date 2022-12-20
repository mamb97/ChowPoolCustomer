const Customer = require('../models/account')
const Orders = require('../models/order')
const OrderUsersTempMapping = require('../models/orderUsersTempMapping')

const {getFormattedAddress, getRandomID, getNewDeadLineDateFromNow, getRemainingDuration} = require("../lib/utility");
const mongoose = require("mongoose");
const {createActiveUserEntries} = require("../lib/activeUsers");

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
    res.status(200).json(order_details)
}

const getOrders = async (req, res) => {
    // Always return pending and completed keys

    const orders = {
        "pending": [
            {
                "order_id": "1",
                "order_status": "self_pickup_pending",
                "shop_name": "KFC",
                "order_total": "$10.00",
            },
            {
                "order_id": "2",
                "order_status": "pickup_done",
                "shop_name": "ABC",
                "order_total": "$20.00",
                "delivery": {
                    "name": "Keith",
                    "phone": "1234567890"
                }
            },
            {
                "order_id": "5",
                "order_status": "pickup_pending",
                "shop_name": "ABC",
                "order_total": "$20.00",
                "delivery": {
                    "name": "Eric",
                    "phone": "1234567899"
                }
            }
        ],
        "completed": [
            {
                "order_id": "3",
                "order_status": "self_pickup_done",
                "shop_name": "KFC",
                "order_total": "$10.00",
            },
            {
                "order_id": "4",
                "order_status": "order_delivered",
                "shop_name": "ABC",
                "order_total": "$20.00",
                "delivery": {
                    "name": "Peter",
                    "phone": "1234567898"
                }
            }
        ]
    }

    res.status(200).json(orders)

}

const getOrderDetails = async (req, res) => {

    //orderConfirmationID should be same as orderID
    const orderID = req.params.id
    let d;
    if (orderID % 2) {
        d = {
            "order_id": orderID,
            "order_status": "pickup_pending",
            "shop_name": "ABC",
            "order_total": "$20.00",
            "delivery": {
                "name": "Jane",
                "phone": "1234567899"
            },
            "order_summary": [
                {"item_id": orderID + "1", "item_name": "ABC", "item_price": "1.00", "qty": "1", "item_cost": "1.00"},
                {"item_id": orderID + "2", "item_name": "EFG", "item_price": "2.00", "qty": "3", "item_cost": "6.00"},
                {"item_id": orderID + "3", "item_name": "MNP", "item_price": "11.00", "qty": "1", "item_cost": "11.00"}
            ]
        }
    } else {
        d = {
            "order_id": orderID,
            "order_status": "pickup_pending",
            "shop_name": "HMP",
            "order_total": "$900.00",
            "delivery": {
                "name": "Mary",
                "phone": "1234567899"
            },
            "order_summary": [
                {"item_id": orderID + "1", "item_name": "r1", "item_price": "11.00", "qty": "1", "item_cost": "11.00"},
                {"item_id": orderID + "2", "item_name": "r2", "item_price": "21.00", "qty": "2", "item_cost": "42.00"},
                {"item_id": orderID + "3", "item_name": "r3", "item_price": "19.00", "qty": "1", "item_cost": "19.00"},
                {"item_id": orderID + "4", "item_name": "r5", "item_price": "17.00", "qty": "2", "item_cost": "34.00"}

            ]
        }
    }
    res.status(200).json(d)
}

const getPendingDeliveries = async (req, res) => {
    // Orders table -> delivery_customer_id = req.user._id + order_status != order_complete
    const orders = await Orders.find({delivering_cust_id: req.user._id, order_status: {$ne: 'order_complete'}})

    const getDistance = async (o) => {
        const orderMap = await OrderUsersTempMapping.findOne({original_cust_order_id: o._id, delivery_cust_id: req.user._id})
        return orderMap.dist
    }
    let pendingDeliveries = []
    for(idx in orders){
        pendingDeliveries.push({
            order_confirmation_id: orders[idx].order_confirmation_id,
            customer_name: orders[idx].cust_name,
            customer_phone: orders[idx].cust_phone,
            customer_address: orders[idx].cust_address,
            distance: await getDistance(orders[idx]),
            shop_name: orders[idx].shop_name,
            shop_address: orders[idx]. shop_address
        })
    }

    res.status(200).json(pendingDeliveries)
}

const updateOrderStatus = async (req, res) => {
    // body contains order_confirmation_id
    // update order_status to order_complete.
    await Orders.findOneAndUpdate({order_confirmation_id: req.body.order_confirmation_id},
        {order_status: 'order_complete'})
    // TODO: Send SMS
    res.status(200).json(req.body)
}
const getPendingRequests = async (req, res) => {
    // customer_name, order_confirmation_id, remaining_time.mins, remaining_time.secs, distance, shop_name, shop_address
    //"time_remaining": { // All pending deliveries this key should be available
    //                     ...getRemainingDuration(Date.parse(Date()) - (60 * 1000), 2, 30)
    //                 },
    const orders = await OrderUsersTempMapping.find({delivery_cust_id: req.user._id,
        requested_date: {$gte: getNewDeadLineDateFromNow(150)},
        status: 'pending'})
    const getOrderData = async (ord) => {
        const o = await Orders.findById(ord.original_cust_order_id)
        return {
            order_confirmation_id: o.order_confirmation_id,
            customer_name: o.cust_name,
            customer_phone: o.cust_phone,
            customer_address: o.cust_address,
            shop_name: o.shop_name,
            shop_address: o. shop_address,
            distance: ord.dist,
            time_remaining: getRemainingDuration(ord.requested_date, 2, 30)
        }
    }

    let pendingRequests = []
    for(let idx in orders){
        pendingRequests.push(await getOrderData(orders[idx]))
    }
    console.log("pendingReq", pendingRequests)
    res.status(200).json(pendingRequests)

}
const updateDeliveryRequestAck = async (req, res) => {
    // body contains order_confirmation_id, status
    // Update temp table status
    const ord = await Orders.findOne({order_confirmation_id: req.body.order_confirmation_id})
    await OrderUsersTempMapping.findOneAndUpdate({original_cust_order_id: ord._id,
        delivery_cust_id: req.user._id}, {'status': req.body.status})
    if(req.body.status === "accepted"){
        const customer = await Customer.findById(ord.cust_id)
        await Orders.findByIdAndUpdate(ord._id, {
            order_status: "accepted",
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