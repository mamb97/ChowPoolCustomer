const {sendSMSMessage} = require("../controllers/notification_handler")
const Customer = require('../models/account')
const Shop = require('../models/shop')

async function sendCustomerSMS(to_cust_id, message) {
    const custData = Customer.findById(to_cust_id)
    sendSMSMessage(custData.phone, message)
}

async function sendShopSMS(phone, message) {
    //const shopData = await Shop.findById(shop_id)
    sendSMSMessage(phone, message)
}

module.exports = {sendCustomerSMS, sendShopSMS}
