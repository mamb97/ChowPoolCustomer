const geolib = require('geolib');
const Shop = require('../models/shop')
const Customer = require('../models/account')

async function getNearbyShops (user_id, userLoc) {
    // Set the center point and the radius (in meters)
    const center = {latitude: userLoc.lat, longitude: userLoc.long};
    const radius = 3000; // 3 km
    const shopsData = await Shop.find()

    let nearbyShopsData = []
    for(let idx in shopsData){
        const shop = shopsData[idx]
        const distance = geolib.getDistance(center, {latitude: shop.lat, longitude: shop.long})
        if(distance <= radius){
            const {_id, menu, email, password, lat, long, ...s} = shop.toJSON()
            nearbyShopsData.push({'dist': distance, 'shop_id': shop._id, 'cust_id': user_id,
                'shop_data': JSON.stringify(s)})
        }
    }

    return nearbyShopsData;

}

async function getNearbyCustomers (shop_data, shop_id, userLoc) {
    // Set the center point and the radius (in meters)
    const center = {latitude: userLoc.lat, longitude: userLoc.long};
    const radius = 1000; // 3 km
    const customersData = await Customer.find()

    let nearbyCustData = []
    for(let idx in customersData){
        const cust = customersData[idx]
        const distance = geolib.getDistance(center, {latitude: cust.lat, longitude: cust.long})
        if(distance <= radius){
            nearbyCustData.push({'dist': distance, 'shop_id': shop_id, 'cust_id': cust._id,
                'shop_data': JSON.stringify(shop_data)})
        }
    }

    return nearbyCustData;

}

module.exports = {getNearbyShops, getNearbyCustomers}
