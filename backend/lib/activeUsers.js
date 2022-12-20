const OrderUsersTempMapping = require("../models/orderUsersTempMapping");
const Orders = require("../models/order");
const {getNewDeadLineDateFromNow, getRemainingDuration, isTimeOverLimit} = require("./utility");
const {getNearbyActiveCustomersByShop} = require("./nearbyPoints");

async function isOrderNew(order_id) {
    const o = await Orders.findOne({_id: order_id, createdAt: {$gte: getNewDeadLineDateFromNow(10 * 60)}});
    return (o && o._id);
}

async function createEntries(cust_id, exclude_cust_list, shop_id, lat, long, order_id) {
    // Find all users at the given shop with order_status = 'order_placed' && cust_id != current user id that are at least 10 min old
    // Exclude the customers that opted-out of delivery
    const cust_orders = await Orders.find({
        cust_id: {$nin: exclude_cust_list}, cust_opt_out_delivery: false,
        order_status: 'order_placed', order_delivery_type: 'self',
        shop_id: shop_id, createdAt: {$lt: getNewDeadLineDateFromNow(10 * 60)}
    })
    // Filtering customers within 1000m radius
    const active_orders = await getNearbyActiveCustomersByShop(cust_orders, [lat, long])
    let active_users = []
    if (active_orders && active_orders.length > 0) {
        let seen = new Set()
        // Filtering duplicate customer records because one customer could have placed multiple orders.
        active_orders.forEach(o => {
            if (!seen.has(o.customer_id)) {
                seen.add(o.customer_id)
                active_users.push({
                    'original_cust_id': cust_id,
                    'status': 'new', 'delivery_cust_id': o.customer_id,
                    'delivery_cust_name': o.customer_name, 'dist': o.dist,
                    'original_cust_order_id': order_id
                })
            }
        })
        await OrderUsersTempMapping.insertMany(active_users)
    }
}

async function createActiveUserEntries(order_id, cust_id, shop_id, lat, long){
    await OrderUsersTempMapping.deleteMany({original_cust_order_id: order_id})
    await createEntries(cust_id, [cust_id], shop_id, lat, long, order_id);
}
async function updateActiveUserEntries(order_id, cust_id, shop_id, lat, long){
    const is_required = await isOrderNew(order_id)
    if(is_required){
        await OrderUsersTempMapping.deleteMany({original_cust_order_id: order_id, status: {$in: ['new', 'pending']}})
        let reject_cust_ids = await OrderUsersTempMapping.find({original_cust_order_id: order_id, 'status': 'rejected'})
        reject_cust_ids = reject_cust_ids.map(o => o.delivery_cust_id)
        reject_cust_ids.push(cust_id)
        await createEntries(cust_id, reject_cust_ids, shop_id, lat, long, order_id);
    }
}

module.exports = {createActiveUserEntries, updateActiveUserEntries, isOrderNew}
