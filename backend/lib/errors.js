const Error = {
    'invalid_address': {
        'status': 400,
        'message': "Oops! Looks like the address details are invalid. Unable to locate its geographic coordinates. Please re-enter the correct address."
    }
}

module.exports = {
    getErrorMessage: function (code) {
        return Error[code] || {'status': 400, 'message': 'Oops! Something went wrong. Please try again later'};
    }
}