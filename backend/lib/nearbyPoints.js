const geolib = require('geolib');
const Shop = require('../models/shop')

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

module.exports = {getNearbyShops}
