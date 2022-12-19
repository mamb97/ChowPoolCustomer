const mongoose = require('mongoose')
const {getRandomID, getFormattedAddress} = require("../lib/utility");

const Schema = mongoose.Schema

const ordersSchema = new Schema({
    cust_id: {type: mongoose.Types.ObjectId, required: true},
    cust_name: {type: String, required: true},
    cust_phone: {type: Number, required: true},
    cust_address: {type: String, required: true},
    cust_lat: {type: Number, required: true},
    cust_long: {type: Number, required: true},
    shop_id: {type: mongoose.Types.ObjectId, required: true},
    shop_name: {type: String, required: true},
    shop_phone: {type: Number, required: true},
    shop_address: {type: String, required: true},
    order_status: {type: String, required: true},
    order_total: {type: Number, required: true},
    order_summary: {type: String, required: true}, //stringified JSON object
    order_delivery_type: {type: String, required: true},
    delivering_cust_id: {type: mongoose.Types.ObjectId},
    delivering_cust_name: {type: String},
    delivering_cust_phone: {type: Number},
    delivering_cust_address: {type: String},
    order_confirmation_id: {type: String, required: true}
}, { timestamps: true })

ordersSchema.statics.create_order = async function(custInfo, cust_address, shopInfo, confirmationID, orderInfo) {
    const createDict = {cust_id:custInfo._id, cust_name: custInfo.name, cust_phone: custInfo.phone,
        cust_address: cust_address, cust_lat: custInfo.lat, cust_long: custInfo.long,
        shop_id: mongoose.Types.ObjectId(shopInfo.shop_id), shop_name: shopInfo.shop_name, shop_phone: shopInfo.shop_phone,
        shop_address: shopInfo.shop_address,
        order_status: orderInfo.order_status, order_total: orderInfo.order_total, order_summary: JSON.stringify(orderInfo.order_summary),
        order_delivery_type: orderInfo.delivery_type, order_confirmation_id: confirmationID}
    const orderDetails = await this.create(createDict)

    return {orderID: orderDetails._id, orderCreationDate: orderDetails.createdAt,
           orderConfirmationID: confirmationID, orderStatus: orderDetails.order_status,
            orderDeliveryType: orderDetails.delivery_type, orderTotal: orderInfo.order_total}
}
module.exports = mongoose.model('Orders', ordersSchema)