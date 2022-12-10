// const Customer = require('../models/account')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const getShops = async (req, res) => {
  
    // const user_id = req.user._id
  
    // if (!mongoose.Types.ObjectId.isValid(user_id)) {
    //   return res.status(404).json({error: 'No such workout'})
    // }
  
    // const cust = await Customer.findById(user_id)
  
    // if (!cust) {
    //   return res.status(404).json({error: 'No such customer'})
    // }

    shops = [{"shop_name": "RES1",
    "shop_open": "08:00",
    "shop_close": "17:00",
    "shop_img": "XXXX", "_id": 1}, {"shop_name": "RES1",
    "shop_open": "08:00",
    "shop_close": "17:00",
    "shop_img": "XXXX", "_id": 2}, 
    {"shop_name": "RES3",
    "shop_open": "08:00",
    "shop_close": "17:00",
    "shop_img": "XXXX", "_id": 3},
    {"shop_name": "RES4",
    "shop_open": "08:00",
    "shop_close": "17:00",
    "shop_img": "XXXX", "_id": 4},
    {"shop_name": "RES5",
    "shop_open": "08:00",
    "shop_close": "17:00",
    "shop_img": "XXXX", "_id": 5},]
    
    res.status(200).json(shops)
  }

const getShopMenu = async (req, res) => {
  
    const shop_id = req._id
  
    // if (!mongoose.Types.ObjectId.isValid(user_id)) {
    //   return res.status(404).json({error: 'No such workout'})
    // }
  
    // const cust = await Customer.findById(user_id)
  
    // if (!cust) {
    //   return res.status(404).json({error: 'No such customer'})
    // }

    shop_menu= {"shop_name": "RES1",
    "shop_open": "08:00",
    "shop_close": "17:00",
    "shop_img": "XXXX", "_id": 1,
    "shop_address": "abcdefghijklmnopqrst abcdefgh",
    "menu": [{
      "item_id": 1,
      "item_name": "Item1",
      "item_description": "Item1 Description",
      "item_price": 10.00
    }, {
      "item_id": 2,
      "item_name": "Item2",
      "item_description": "Item2 Description",
      "item_price": 11.00
    }, 
    {
      "item_id": 3,
      "item_name": "Item3",
      "item_description": "Item3 Description",
      "item_price": 12.00
    },
    {
      "item_id": 4,
      "item_name": "Item4",
      "item_description": "Item4 Description",
      "item_price": 13.00
    },
    {
      "item_id": 5,
      "item_name": "Item5",
      "item_description": "Item5 Description",
      "item_price": 14.00
    }]
    }
    res.status(200).json(shop_menu)
  }

module.exports = {getShops, getShopMenu}