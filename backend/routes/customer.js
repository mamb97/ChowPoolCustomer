const express = require('express')

// controller functions
const { updateAccount, getAccount } = require('../controllers/account')
const {getShops, getShopMenu} = require('../controllers/shop')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all workout routes
router.use(requireAuth)

// account route
router.post('/account', updateAccount)
router.get('/account', getAccount)

router.get('/shops', getShops)
router.get('/shop/:id', getShopMenu)
module.exports = router