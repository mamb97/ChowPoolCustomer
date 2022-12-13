const express = require('express')

// controller functions
const { updateAccount, getAccount, getActiveUsers, UserPickupStatus } = require('../controllers/account')
const {getShops, getShopMenu} = require('../controllers/shop')
const {getOrders, getOrderDetails, createOrder, updateOrderDeliveryType, 
    updateOrderStatus, postDeliveries, postDeliveryDetails, updateDeliveryRequestAck} = 
    require('../controllers/order')

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
router.post('/user_pickup_status', UserPickupStatus)

router.get('/orders', getOrders)
router.get('/order/:id', getOrderDetails)
router.post('/order/create', createOrder)
router.post('/order/update_delivery_type', updateOrderDeliveryType)
router.post('/order/update_order_status', updateOrderStatus)

router.post('/deliveries', postDeliveries)
router.post('/delivery/:id', postDeliveryDetails)
router.post('/delivery/ack', updateDeliveryRequestAck)

module.exports = router