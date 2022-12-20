const express = require('express')

// controller functions
const {sendSMSMessage} = require('../controllers/notification_handler')
const {getShops, getShopMenu} = require('../controllers/customer_menu')
const {updateAccount, getAccount, getActiveUsers, sendRequest} = require('../controllers/customer_account')
const {getOrders, getOrderDetails, createOrder, updateOrderStatus, getPendingRequests, getPendingDeliveries,
     updateDeliveryRequestAck} = require('../controllers/customer_order')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()


router.use(requireAuth)

// account route
router.post('/account', updateAccount)
router.get('/account', getAccount)

router.get('/shops', getShops)
router.get('/shops/menu/:id', getShopMenu)

router.get('/active_users/:order_id', getActiveUsers)
router.post('/order/create', createOrder)
router.post('/delivery/request/send', sendRequest)


router.get('/delivery/incoming', getPendingRequests)
router.post('/delivery/ack', updateDeliveryRequestAck)

router.get('/delivery/pending', getPendingDeliveries)
router.post('/delivery/status', updateOrderStatus)

router.get('/orders', getOrders)
router.get('/order/:id', getOrderDetails)

router.post('/send/sms', sendSMSMessage)

module.exports = router