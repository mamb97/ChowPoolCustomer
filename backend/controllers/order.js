const Customer = require('../models/account')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const getOrders = async (req, res) => {

    res.status(200).json([])

}

const getOrderDetails = async (req, res) => {
    const orderID = req.params.id
}

const getDeliveries = async (req, res) => {
    
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

module.exports = {
    getOrders, getOrderDetails, createOrder, updateOrderDeliveryType, updateOrderStatus, getDeliveries
}