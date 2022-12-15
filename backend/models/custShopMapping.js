const mongoose = require('mongoose')

const Schema = mongoose.Schema

const custShopMappingSchema = new Schema({
    cust_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    shop_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    dist: {type: Number, required: true},
    shop_data: {type: String, required: true}
})

custShopMappingSchema.statics.createEntries = async function(cust_id, shop_data) {

}

module.exports = mongoose.model('CustShopMapping', custShopMappingSchema)