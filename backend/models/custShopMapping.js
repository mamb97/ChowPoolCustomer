const mongoose = require('mongoose')

const Schema = mongoose.Schema

const shopSummarySchema = new Schema({
    shop_name: {type: String, required: true},
    shop_open: {type: String, required: true},
    shop_close: {type: String, required: true},
    shop_img: {type: String, required: true}
})

const custShopMappingSchema = new Schema({
  cust_id: {
    type: ObjectId,
    required: true
  },
  shops: [shopSummarySchema]
})

module.exports = mongoose.model('custShopMapping', custShopMappingSchema)