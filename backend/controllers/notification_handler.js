// SMS notification handler
const service_url = process.env.SMS_SERVICE_URL
const sendSMSMessage = async (number, message) => {
    if(number && message){
        const response = await fetch(`${service_url}/text`, {
            headers: {'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({number, message})
        })
        const json = await response.json()

    }
}

module.exports = {sendSMSMessage}