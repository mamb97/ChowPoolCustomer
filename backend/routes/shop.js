const requireShopAuth = require('../middleware/requireShopAuth')
const express = require('express')
const router = express.Router()

const {getShopAccount, updateShopAccount} = require('../controllers/shop_account')
const {createShopMenu, deleteShopMenu, getShopMenuData} = require('../controllers/shop_menu')
const {getShopOrders, getShopOrderDetails, updateShopOrderStatus} = require('../controllers/shop_order')


router.use(requireShopAuth)

router.get('/shop/account', getShopAccount)
router.post('/shop/account', updateShopAccount)

router.get('/shop/menu', getShopMenuData)
router.post('/shop/menu', createShopMenu)
router.delete('/shop/menu/:item_id', deleteShopMenu)

router.get('/shop/orders', getShopOrders)
router.get('/shop/order/:id', getShopOrderDetails)
router.post('/shop/order/update_status', updateShopOrderStatus)

module.exports = router