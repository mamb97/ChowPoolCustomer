const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const getShopOrders = async (req, res) => {
    console.log("GET SHOP ORDER CALL")
    // Pending should contain orders with status "order_placed" or "pickup_accepted"
    // Everything else should be considered complete.
    const orders = {
        "pending": [
            {
                "order_id": "1",
                "order_status": "self_pickup_pending",
                "cust_name": "ABC",
                "cust_phone": "1234567890",
                "order_total": "$10.00",
            },
            {
                "order_id": "2",
                "order_status": "pickup_done",
                "cust_name": "ABC",
                "cust_phone": "1234567890",
                "order_total": "$20.00",
                "delivery": {
                    "name": "Keith",
                    "phone": "1234567890"
                }
            },
            {
                "order_id": "5",
                "order_status": "pickup_pending",
                "cust_name": "ABC",
                "cust_phone": "1234567890",
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
                "cust_name": "ABC",
                "cust_phone": "1234567890",
                "order_total": "$10.00",
            },
            {
                "order_id": "4",
                "order_status": "order_delivered",
                "cust_name": "ABC",
                "cust_phone": "1234567890",
                "order_total": "$20.00",
                "delivery": {
                    "name": "Peter",
                    "phone": "1234567898"
                }
            }
        ]
    }
    console.log("Orders Back: ", orders)
    res.status(200).json(orders)
}

const getShopOrderDetails = async (req, res) => {

    //orderConfirmationID should be same as orderID
    const orderID = req.params.id
    let d;
    if (orderID % 2) {
        d = {
            "order_id": orderID,
            "order_status": "pickup_pending",
            "cust_name": "ABC",
            "cust_phone": "1234567890",
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
            "cust_name": "ABC",
            "cust_phone": "1234567890",
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

const updateShopOrderStatus = async (req, res) => {

    // Update the order status either "order_delivered"

}

module.exports = {getShopOrders, getShopOrderDetails, updateShopOrderStatus}