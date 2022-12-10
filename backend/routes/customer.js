const express = require('express')

// controller functions
const { updateAccount, getAccount, getActiveUsers } = require('../controllers/account')
const {getShops, getShopMenu} = require('../controllers/shop')
const {getOrders, getOrderDetails, createOrder, updateOrder} = require('../controllers/order')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all workout routes
router.use(requireAuth)

// account route
router.post('/account', updateAccount)
router.get('/account', getAccount)

router.get('/shops', getShops)
router.get('/shop/:id', getShopMenu)

router.get('/active_users/:shop_id', getActiveUsers)

router.get('/orders', getOrders)
router.get('/order/:id', getOrderDetails)
router.post('/order/create/:id', createOrder)
router.post('/order/update/:id', updateOrder)

module.exports = router