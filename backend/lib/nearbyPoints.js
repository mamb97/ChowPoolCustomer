const geolib = require('node-geolib');

async function getNearbyShops (userLoc, shopsData) {
    // Set the center point and the radius (in meters)
    const center = {latitude: userLoc.lat, longitude: userLoc.long};
    const radius = 3000; // 3 km

    return shopsData.filter(shop => {
        // Calculate the distance between the center point and the coordinate
        const distance = geolib.getDistance(center, {latitude: shop.lat, longitude: shop.long});
        
        // Return true if the distance is less than or equal to the radius
        return distance <= radius;
      });
}

module.exports = {getNearbyShops}
