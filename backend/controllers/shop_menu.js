const ShopMenu = require('../models/shopMenu')

const getShopMenuData = async (req, res) => {
    const shop_id = req.user._id
    const menu_info = await ShopMenu.find({shop_id: shop_id})

    res.status(200).json(menu_info)
}

const createShopMenu = async (req, res) => {
    const {itemName, itemDesc, itemPrice, availability} = req.body

    try {
        const shop_id = req.user._id
        const m = await ShopMenu.create({
            shop_id: shop_id, item_name: itemName, item_description: itemDesc,
            item_price: itemPrice, availability: availability})
        res.status(200).json(m)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// delete a workout
const deleteShopMenu = async (req, res) => {

    const idx = req.params.item_id

    const m = await ShopMenu.findByIdAndDelete(idx)

    if (!m) {
        return res.status(400).json({error: 'No such menu item'})
    }

    res.status(200).json(m)
}
//shop_menu - delete, post, idx, id, name, desc, price, availability

module.exports = {createShopMenu, deleteShopMenu, getShopMenuData}