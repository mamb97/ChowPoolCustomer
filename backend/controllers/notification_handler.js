require('dotenv').config()
// SMS notification handler
const Customer = require('../models/account')
const sendSMSMessage = async (number, message) => {

    if(number && message){
        const response = await fetch('http://localhost:3008/text', {
            headers: {'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({number, message})
        })
        const json = await response.json()

    }
}

module.exports = {sendSMSMessage}