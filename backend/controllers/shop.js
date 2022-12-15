const CustShopMapping = require('../models/custShopMapping')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const isShopOpen = (open, close, openDays) => {
    const getT = (t) => {
        return t[0]*60 + t[1];
    }
    const today = new Date()
    if(!openDays[today.getDay()])
        return false
    const start = getT(open.split(':').map(o=> Number(o)));
    const end = getT(close.split(':').map(o=> Number(o)));
    const now = getT([today.getHours(), today.getMinutes()]);
    return (start <= now && now <= end)

}

const getShops = async (req, res) => {
    const customer_id = req.user._id
    if (!mongoose.Types.ObjectId.isValid(customer_id)) {
      return res.status(404).json({error: 'No such customer'})
    }
    // Returning shops list in ascending order of the distance
    const shops = await CustShopMapping.find({cust_id: customer_id}).sort({ dist: 1 } )
    if (!shops) {
      return res.status(404).json({error: 'No valid shops '})
    }
    else {
        let shopsInfo = []
        for (let s in shops){
            const shop_data = JSON.parse(shops[s].shop_data)
            if(!isShopOpen(shop_data.startTime, shop_data.endTime, shop_data.openDays))
                continue
            shopsInfo.push({
                'shop_name': shop_data.name, 'phone': shop_data.phone, 'shop_id': shops[s].shop_id,
                'distance': Math.round(shops[s].dist/1000, 2), 'open': shop_data.startTime,
                'close': shop_data.endTime,
                'address': `${shop_data.streetAddress} ${shop_data.unitNumber}, ${shop_data.city}, ${shop_data.state}, ${shop_data.zipcode}`
            })
        }
        res.status(200).json(shopsInfo)
    }
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