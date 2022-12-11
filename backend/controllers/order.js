const Customer = require('../models/account')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const getOrders = async (req, res) => {

}

const getOrderDetails = async (req, res) => {
    
}

const createOrder = async (req, res) => {
    res.status(200).json(req.body)
}

const updateOrder = async (req, res) => {

    res.status(200).json(req.body)
    
}

module.exports = {
    getOrders, getOrderDetails, createOrder, updateOrder
}