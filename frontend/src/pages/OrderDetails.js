import { useEffect, useState }from 'react'
import { useAuthContext } from "../hooks/useAuthContext"
import { useParams } from 'react-router-dom'


const OrderDetails = () => {
    const {user} = useAuthContext()
    const [orderData, setOrderData] = useState(null)

    const { id } = useParams()
    console.log("Order ID", id)

    const getOrderData = (order_data) => {
        return (
            <div className="orders">
                <p> Order Details </p>
                <div className="flexbox-container col-two">
                    <div>
                        <p><strong>Order ID: </strong>{order_data.order_id}</p>
                        <p><strong>Order Status: </strong>{order_data.order_status}</p>
                        <p><strong>Shop Name: </strong>{order_data.shop_name}</p>
                        <p><strong>Order Total: </strong>${order_data.order_total}</p>
                        {order_data.delivery && 
                            (<div>
                            <p><strong>Delivery Person: </strong>{order_data.delivery.name}</p>
                            <p><strong>Contact Phone: </strong>{order_data.delivery.phone}</p>
                            </div>) ||
                            (<p className="flexbox-container"><strong>Delivery Type: </strong>Self pick-up</p>)}
                    </div>
                    <div>
                        <p style={{textAlign: "center"}}><strong>Order Summary </strong></p>
                        <div className="shopcards-details order-summary">
                            <p><strong>Order Summary</strong></p>
                            <table style={{borderColor: "red", borderWidth: "2px"}}>
                            {order_data.order_summary && order_data.order_summary.map(o => (
                                <tbody key={o.item_id} className="order-summary-items flexbox-container" style={{width: "100%"}}>
                                    <p>{o.item_name}</p>
                                    <p>${o.item_price} x {o.qty}</p>
                                    <p style={{float: "right"}}>${o.item_cost}</p>
                                </tbody>
                            ))}
                            </table>
                        </div> 
                    </div>
                </div>    
            </div>
    
        )
    }

    useEffect(() => {
        const fetchOrder = async () => {
          const response = await fetch('/api/order/' + id, {
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