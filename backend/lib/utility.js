const { randomUUID } = require('crypto');

async function getRandomID(){return randomUUID()}

async function getFormattedAddress(streetAddress, unitNumber, city, state, zipcode){
    return `${streetAddress} ${unitNumber}, ${city}, ${state}, ${zipcode}`;
}

async function getFormattedOrderStatus(orderStatus, delivery_type){
    const states = {'order_placed': 'Order Placed'}
    return states[orderStatus]
}

const getRemainingDuration = (startDate, mins, secs) => {
    const deadLineTime = Date.parse(startDate) + ((mins * 60 + secs) * 1000)
    const now = Date.parse(Date())
    let remainingMins = 0
    let remainingSecs = 0
    if (now < deadLineTime) {
        const seconds = (deadLineTime - now) / 1000;
        remainingMins = Math.round(seconds / 60)
        remainingSecs = seconds % 60
    }
    return {'mins': remainingMins, 'secs': remainingSecs}
}

module.exports = {getRandomID, getFormattedAddress, getRemainingDuration}
