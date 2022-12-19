const { randomUUID } = require('crypto');

async function getRandomID(){return randomUUID()}

async function getFormattedAddress(streetAddress, unitNumber, city, state, zipcode){
    return `${streetAddress} ${unitNumber}, ${city}, ${state}, ${zipcode}`;
}

async function getFormattedOrderStatus(orderStatus, delivery_type){
    const states = {'order_placed': 'Order Placed'}
    return states[orderStatus]
}

module.exports = {getRandomID, getFormattedAddress, getFormattedOrderStatus}
