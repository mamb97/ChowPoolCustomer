import {useEffect} from 'react'
import {useOrdersContext} from "../hooks/useOrdersContext"
import {useAuthContext} from "../hooks/useAuthContext"
import {Link} from 'react-router-dom'


const OrderData = ({order_data}) => {

    return (
        <div>
            <div className="flexbox-container col-two">
                <p><strong>Order ID: </strong>{order_data.order_id}</p>
                <p><strong>Order Status: </strong>{order_data.order_status}</p>
                <p><strong>Order Total: </strong>${order_data.order_total}</p>
            </div>
            <div className="flexbox-container col-two">
                <p><strong>Cust Name: </strong>{order_data.cust_name}</p>
                <p><strong>Cust Phone: </strong>${order_data.cust_phone}</p>
            </div>
            {order_data.delivery_name &&
                (<div className="flexbox-container col-two">
                    <p><strong>Delivery Person: </strong>{order_data.delivery_name}</p>
                    <p><strong>Contact Phone: </strong>{order_data.delivery_name}</p>
                </div>) ||
                (<p className="flexbox-container"><strong>Delivery Type: </strong>Self pick-up</p>)}
        </div>
    )

}

const Order = () => {
    const {user} = useAuthContext()
    const {orders, dispatch} = useOrdersContext()

    const updateOrderStatus = (order_id) => {
        const updateOrder = async () => {
            const response = await fetch('/api/shop/order/update_status', {
                headers: {'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify({order_id})
            })
            const json = await response.json()
        }

        if (user) {
            updateOrder()
        }

    }

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await fetch('/api/shop/orders', {
                headers: {'Authorization': `Bearer ${user.token}`},
            })
            const json = await response.json()
            if (response.ok) {
                console.log("Orders: ", json)
                dispatch({type: 'SET_ORDERS', payload: json})
            }
        }

        if (user) {
            fetchOrders()
        }
    }, [orders])

    return (
        <div className="orders">
            <div/>
            <div>
                {orders && orders["pending"].map((order) => (
                    <div className="shopcards-details" style={{background: "#fee1e8"}}>
                        <OrderData key={order.order_id} order_data={order}/>
                        <div className='flexbox-container'>
                            <p>Is the order picked-up?</p>
                            <button onClick={updateOrderStatus.bind(this, order.order_id)}>Yes</button>
                        </div>
                        <Link className="btn btn-link" to={`/order/${order.order_id}`}>View Order Details</Link>
                    </div>
                ))}
            </div>
            <div>
                {orders && orders["completed"].map((order) => (
                    <div className="shopcards-details" style={{background: "#f6eac2"}}>
                        <OrderData key={order.order_id} order_data={order}/>
                        <Link className="btn btn-link" to={`/order/${order.order_id}`}>View Order Details</Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Order