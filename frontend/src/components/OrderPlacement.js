import {useState, useEffect} from "react"
import {useShopsContext} from '../hooks/useShopsContext'
import {useAuthContext} from '../hooks/useAuthContext'
import {Link} from 'react-router-dom'


import ActiveUsers from './ActiveUsers';
import {Timer} from '../hooks/useTimer'

const OrderPlacement = x => {
    const {user} = useAuthContext()
    const {menuOrderDataContext, dispatch} = useShopsContext()
    const [showActiveUsers, setShowActiveUsers] = useState(false)
    const [orderTotal, setOrderTotal] = useState(0)
    const [orderConfirmationID, setOrderConfirmationID] = useState('')
    const [orderSummary, setOrderSummary] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const getOrderInfo = () => {
        if (!menuOrderDataContext) {
            return {}
        }
        const {shopInfo, ...orderData} = menuOrderDataContext

        let orderValue = 0
        let orderSummaryData = []
        for (let k in orderData) {
            const ordercost = parseFloat((orderData[k]["qty"] * orderData[k]["item_price"]).toFixed(2))
            orderSummaryData.push({...orderData[k], "item_cost": ordercost})
            orderValue += ordercost
        }
        orderValue = parseFloat(orderValue.toFixed(2))
        setOrderTotal(orderValue)
        setOrderSummary(orderSummaryData)
    }

    useEffect(() => {
        getOrderInfo()
    }, [])

    const handleOrderConfirmation = () => {
        setIsLoading(true)
        if (!user) {
            setIsLoading(false)
            return
        }
        const createOrder = async () => {
            const response = await fetch('/api/order/create', {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}`},
                body: JSON.stringify({order_summary:orderSummary, order_total: orderTotal, shop_info:menuOrderDataContext["shopInfo"]})
            })
            const json = await response.json()
            if (response.ok) {
                setIsLoading(false)
                dispatch({type: 'SET_MENU_DATA', payload: {...menuOrderDataContext, "orderInfo": json}})
                setOrderConfirmationID(json.orderConfirmationID)
                setOrderTotal(json.orderTotal)
                setShowActiveUsers(true)

            }
        }
        createOrder()
    }

    if (showActiveUsers) {
        return (
            <div>
                <div className="shopcards-details order-summary-header">
                    <p><strong>Your order is now placed!!</strong></p>
                    <Link className="btn btn-link" style={{color: "#1aac83"}} to={`/order/${orderConfirmationID}`}>Track your Order Here</Link>
                    <p><strong>Order Confirmation ID:</strong> {orderConfirmationID}</p>
                    <p><strong>Order Total:</strong> ${orderTotal}</p>
                </div>
                <div>
                    <h4>Active Users!</h4>
                    <Timer
                        message="You have 10 minutes to send request to any of the other users at the shop to pickup your order." mins={10} sec={0}/>
                    <ActiveUsers/>
                </div>
            </div>
        )
    } else {
        return (
            <div className="order-placement-form">
                <div>
                    <div className="shopcards-details order-summary">
                        <p><strong>Order Summary</strong></p>
                        <div className="shopcards-details">
                            <table>
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price x Qty</th>
                                    <th>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orderSummary && orderSummary.map(o => (
                                    <tr key={o.item_id}>
                                        <td>{o.item_name}</td>
                                        <td>${o.item_price} x {o.qty}</td>
                                        <td>${o.item_cost}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td/>
                                    <td><strong>Order Total: </strong></td>
                                    <td>${orderTotal}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <button onClick={handleOrderConfirmation} disabled={isLoading}>Confirm Order</button>
                </div>
            </div>
                )}}

export default OrderPlacement;