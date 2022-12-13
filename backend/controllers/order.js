const Customer = require('../models/account')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const states = {
    "pending": {"self_pickup_pending": "Pickup Pending", "pickup_done": "Picked-Up", "pickup_pending": "Pickup Pending"}, 
    "completed": {"self_pickup_done": "Pickup Complete", "order_delivered": "Order Delivered"}
}

const getOrders = async (req, res) => {
    // Always return pending and completed keys

    const orders = {
        "pending": [
            {"order_id": "1",
             "order_status": "self_pickup_pending",
             "shop_name": "KFC", 
             "order_total": "$10.00",
            },
            {"order_id": "2",
             "order_status": "pickup_done",
             "shop_name": "ABC", 
             "order_total": "$20.00",
             "delivery": {
                "name": "Keith",
                "phone": "1234567890"
             } 
            },
            {"order_id": "5",
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
            {"order_id": "3",
            "order_status": "self_pickup_done",
            "shop_name": "KFC", 
            "order_total": "$10.00",
            },
            {"order_id": "4",
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
    if(orderID%2){
        d = {"order_id": orderID,
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
        ]}}
    else{
        d = {"order_id": orderID,
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

        ]}}
        res.status(200).json(d)
    }

const getRemainingDuration = (startDate, mins, secs) => {
    const deadLineTime = startDate + ((mins * 60 + secs) * 1000)
    const now = Date.parse(Date())
    let remainingMins = 0
    let remainingSecs = 0
    if (now < deadLineTime){
        const seconds = (deadLineTime-now)/1000;
        console.log(seconds, now)
        remainingMins = Math.round(seconds/60)
        remainingSecs = seconds%60
    }
    return {'mins': remainingMins, 'secs': remainingSecs}
}

const postDeliveries = async (req, res) => {
    //If remainingDuration is 0, update delivery pickup request to rejected. 

    const orders = {
        "pending": [
            {"order_id": "1",
             "order_status": "self_pickup_pending",
             "shop_name": "KFC", 
             "order_total": "$10.00",
             "time_remaining": { // All pending deliveries this key should be available
                ...getRemainingDuration(Date.parse('Mon Dec 12 2022 17:49:50 GMT-0800 (Pacific Standard Time)'), 2, 30)
             },             
             "customer": {
                "name": "Merly",
                "phone": "1234567890",
                "address": "ABCDEFGH"
             }
            },
            // {"order_id": "2",
            //  "order_status": "pickup_done",
            //  "shop_name": "ABC", 
            //  "order_total": "$30.00",
            //  "customer": {
            //     "name": "Keith",
            //     "phone": "1234567890"
            //  } 
            // },
            {"order_id": "5",
             "order_status": "pickup_pending",
             "shop_name": "ABC", 
             "order_total": "$20.00",
             "time_remaining": { // All pending deliveries this key should be available
                ...getRemainingDuration(Date.parse(Date()) - (60 * 1000), 2, 30)
             }, 
             "customer": {
                "name": "Eric",
                "phone": "1234567899",
                "address": "ABCDEFGH"
             } 
            }
        ],
        "accepted": [ 
            {"order_id": "3",
            "order_status": "self_pickup_done",
            "shop_name": "KFC", 
            "order_total": "$10.00",
            "customer": {
                "name": "Erica",
                "phone": "1234567899",
                "address": "ABCDEFGH"
             } 
            },
            {"order_id": "4",
                "order_status": "order_delivered",
                "shop_name": "ABC", 
                "order_total": "$20.00",
                "customer": {
                    "name": "Peril",
                    "phone": "1234567899",
                    "address": "ABCDEFGH"
                 } 
            }
        ],
        "completed": [ 
            {"order_id": "6",
            "order_status": "self_pickup_done",
            "shop_name": "KFC", 
            "order_total": "$10.00",
            "customer": {
                "name": "Erica",
                "phone": "1234567899",
                "address": "ABCDEFGH"
             } 
            },
            {"order_id": "7",
                "order_status": "order_delivered",
                "shop_name": "ABC", 
                "order_total": "$20.00",
                "customer": {
                    "name": "Peril",
                    "phone": "1234567899",
                    "address": "ABCDEFGH"
                 } 
            }
        ]
    }

    res.status(200).json(orders)
    
}

const postDeliveryDetails = async (req, res) => {

    const orders = {
        "pending": [
            {"order_id": "1",
             "order_status": "self_pickup_pending",
             "shop_name": "KFC", 
             "order_total": "$10.00",
             "time_remaining": { // All pending deliveries this key should be available
                ...getRemainingDuration(Date.parse('Mon Dec 12 2022 17:49:50 GMT-0800 (Pacific Standard Time)'), 2, 30)
             },             
             "customer": {
                "name": "Merly",
                "phone": "1234567890",
                "address": "ABCDEFGH"
             }
            }
        ],
        "accepted": [ 
            
        ],
        "completed": [ 
        ]
    }

    res.status(200).json(orders)

}

const updateOrderStatus = async (req, res) => {


}

const createOrder = async (req, res) => {
    // Generate Order Confirmation ID and return it.
    res.status(200).json({...req.body, 'orderConfirmationID': '123456'})
}

const updateOrderDeliveryType = async (req, res) => {

    res.status(200).json(req.body)
    
}

const updateDeliveryRequestAck = async (req, res) => {
    
}

module.exports = {
    getOrders, getOrderDetails, createOrder, updateOrderDeliveryType, 
    updateOrderStatus, postDeliveries, postDeliveryDetails, updateDeliveryRequestAck
}