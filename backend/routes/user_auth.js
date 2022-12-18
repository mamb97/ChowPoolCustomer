const express = require('express')

// controller functions
const { loginUser, signupUser } = require('../controllers/customer_account')
const {loginShopUser, signupShopUser} = require('../controllers/shop_account')

const router = express.Router()

// login route
router.post('/login', loginUser)
router.post('/shop/login', loginShopUser)

// signup route
router.post('/signup', signupUser)
router.post('/shop/signup', signupShopUser)

module.exports = router