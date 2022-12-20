import {useEffect, useState} from 'react'
import {useAuthContext} from "../hooks/useAuthContext"
import {useParams} from 'react-router-dom'

const OrderDetails = () => {
    const {user} = useAuthContext()
    const [orderData, setOrderData] = useState(null)

    const {id} = useParams()

    const getOrderData = (order_data) => {
        return (
            <div className="orders">
                <div className="flexbox-container col-two">
                    <div>
                        <p style={{textAlign: "center"}}><strong>Order Details </strong></p>
                        <table className="shopcards-details" style={{width: "100%"}}>
                            <tbody>
                            <tr>
                                <td><strong>Order ID: </strong></td>
                                <td>{order_data.order_id}</td>
                            </tr>
                            <tr>
                                <td><strong>Order Status: </strong></td>
                                <td>{order_data.order_status}</td>
                            </tr>
                            <tr>
                                <td><strong>Customer Name: </strong></td>
                                <td>{order_data.cust_name}</td>
                            </tr>
                            <tr>
                                <td><strong>Customer Phone: </strong></td>
                                <td>{order_data.cust_phone}</td>
                            </tr>
                            {order_data.delivery_name && (
                                <tr>
                                    <td><strong>Delivery Person: </strong></td>
                                    <td>{order_data.delivery_name}</td>
                                </tr>)}
                            {order_data.delivery_name && (<tr>
                                <td><strong>Contact Phone: </strong></td>
                                <td>{order_data.delivery_phone}</td>
                            </tr>)}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <p style={{textAlign: "center"}}><strong>Order Summary </strong></p>
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
                                {order_data.order_summary && order_data.order_summary.map(o => (
                                    <tr key={o.item_id}>
                                        <td>{o.item_name}</td>
                                        <td>${o.item_price} x {o.qty}</td>
                                        <td>${o.item_cost}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td/>
                                    <td><strong>Order Total: </strong></td>
                                    <td>${order_data.order_total}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    useEffect(() => {
        const fetchOrder = async () => {
            const response = await fetch('/api/shop/order/' + id, {
                headers: {'Authorization': `Bearer ${user.token}`},
            })
            const json = await response.json()
            if (response.ok) {
                setOrderData(json)
            }
        }

        if (user) {
            fetchOrder()
        }
    }, [orderData])

    return orderData && getOrderData(orderData)

}

export default OrderDetails