const {sendSMSMessage} = require("../controllers/notification_handler")
const Customer = require('../models/account')
const Shop = require('../models/shop')

const sendCustomerSMS = async (to_cust_id, message) => {
    const custData = Customer.findById(to_cust_id)
    sendSMSMessage(custData.phone, message)
}

const sendShopSMS = async (shop_id, message) => {
    const shopData = await Shop.findById(shop_id)
    sendSMSMessage(shopData.phone, message)
}

module.export = {sendCustomerSMS, sendShopSMS}
