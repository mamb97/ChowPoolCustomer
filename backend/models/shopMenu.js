const mongoose = require('mongoose')

const Schema = mongoose.Schema

const shopMenuSchema = new Schema({
    shop_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    item_name: {type: String, required: true},
    item_description: {type: String, required: true},
    item_price: {type: Number, required: true},
    availability: {type: Boolean, required: true}
})

module.exports = mongoose.model('ShopMenu', shopMenuSchema)
