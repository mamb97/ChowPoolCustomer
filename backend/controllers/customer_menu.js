const CustShopMapping = require('../models/custShopMapping')
const ShopMenu = require("../models/shopMenu");
const Shop = require("../models/shop");

const {getFormattedAddress} = require("../lib/utility")

const isShopOpen = (open, close, openDays) => {
    const getT = (t) => {
        return t[0] * 60 + t[1];
    }
    const today = new Date()
    if (!openDays[today.getDay()])
        return false
    const start = getT(open.split(':').map(o => Number(o)));
    const end = getT(close.split(':').map(o => Number(o)));
    const now = getT([today.getHours(), today.getMinutes()]);
    return (start <= now && now <= end)

}

const getShops = async (req, res) => {
    const customer_id = req.user._id
    // Returning shops list in ascending order of the distance
    const shops = await CustShopMapping.find({cust_id: customer_id}).sort({dist: 1})
    if (!shops) {
        return res.status(404).json({error: 'No valid shops '})
    } else {
        let shopsInfo = []
        for (let s in shops) {
            const shop_data = JSON.parse(shops[s].shop_data)
            if (!isShopOpen(shop_data.startTime, shop_data.endTime, shop_data.openDays))
                continue
            shopsInfo.push({
                'shop_name': shop_data.name, 'phone': shop_data.phone, 'shop_id': shops[s].shop_id,
                'distance': Math.round(shops[s].dist / 1000, 2), 'open': shop_data.startTime,
                'close': shop_data.endTime,
                'address': await getFormattedAddress(shop_data.streetAddress, shop_data.unitNumber,
                    shop_data.city, shop_data.state, shop_data.zipcode)
            })
        }
        res.status(200).json(shopsInfo)
    }
}

const getShopMenu = async (req, res) => {
    const shop_id = req.params.id
    const menu_info = await ShopMenu.find({shop_id: shop_id, availability: true})
    const shop_info = await Shop.findById(shop_id)
    const s = {
        "shop_name": shop_info.name,
        "shop_open": shop_info.startTime,
        "shop_close": shop_info.endTime,
        "shop_phone": shop_info.phone,
        "shop_id": shop_id,
        "shop_address": await getFormattedAddress(shop_info.streetAddress, shop_info.unitNumber,
            shop_info.city, shop_info.state, shop_info.zipcode),
        "menu": menu_info
    }
    res.status(200).json(s)
}

module.exports = { getShops, getShopMenu }