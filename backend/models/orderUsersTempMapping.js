const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderUsersTempMappingSchema = new Schema({
    status: {type: String, required: true}, // new, pending, rejected, accepted
    original_cust_id: {type: mongoose.Types.ObjectId, required: true},
    delivery_cust_id: {type: mongoose.Types.ObjectId, required: true},
    delivery_cust_name: {type: String, required: true},
    original_cust_order_id: {type: mongoose.Types.ObjectId, required: true},
    dist: {type: Number, required: true},
    requested_date: {type: Date}
})

module.exports = mongoose.model('OrderUsersTempMapping', orderUsersTempMappingSchema)