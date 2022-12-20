import { useEffect, useState }from 'react'
import { useAuthContext } from "../hooks/useAuthContext"
import { Link, useParams } from 'react-router-dom'

const DeliveryData = ({order_data}) => {

    return (
        <div>
            <div className="flexbox-container col-two">
              <p><strong>Order ID: </strong>{order_data.order_id}</p>
              <p><strong>Order Status: </strong>{order_data.order_status}</p>
            </div>
            <div className="flexbox-container col-two">
              <p><strong>Shop Name: </strong>{order_data.shop_name}</p>
              <p><strong>Order Total: </strong>${order_data.order_total}</p>
            </div>
            <div className="flexbox-container col-two">
              <p><strong>Customer Name: </strong>{order_data.customer.name}</p>
              <p><strong>Contact Phone: </strong>{order_data.customer.phone}</p>
            </div>
        </div>
    )
    
}

export const Deliveries = ({delivery_id}) => {
  const {user} = useAuthContext()
  const [deliveryData, setDeliveryData] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      let response;
      if(delivery_id){
        response = await fetch('/api/delivery/' + delivery_id, {
          headers: {'Authorization': `Bearer ${user.token}`},
          method: 'POST'
        })
      }
      else {
        response = await fetch('/api/deliveries', {
          headers: {'Authorization': `Bearer ${user.token}`},
          method: 'POST'
        })
      }
      
      const json = await response.json()
      if (response.ok) {
        setDeliveryData(json)
      }
    }

    if (user) {
        fetchOrders()
    }
  }, [deliveryData])

  const updateOrderStatus = (order_id) => {
    const updateOrder = async () => {
      const response = await fetch('/order/update_order_status', {
        headers: {'Authorization': `Bearer ${user.token}`},
        method: 'POST',
        body: JSON.stringify({order_id, 'status': 'order_delivered'})
      })
      const json = await response.json()
    }

    if (user) {
      updateOrder()
    }

  }

  const ackRequest = (order_id, status) => {
    const updateOrder = async () => {
      const response = await fetch('/order/delivery/ack', {
        headers: {'Authorization': `Bearer ${user.token}`},
        method: 'POST',
        body: JSON.stringify({order_id, 'status': status})
      })
      const json = await response.json()
    }

    if (user) {
      updateOrder()
    }

  }

  return deliveryData && (
    <div className="orders">
        <h4>Delivery History</h4>
      <div>
        {deliveryData && deliveryData["pending"].map((order) => (
          <div className="shopcards-details">
            <div className='flexbox-container'>
              <p><strong>{order.customer.name}</strong> is requesting to pickup the order.</p>
              <button onClick={ackRequest.bind(this, order.order_id, "accept")}>Accept</button>
              <button onClick={ackRequest.bind(this, order.order_id, "reject")}>Reject</button>
            </div>
            <div>          
              { order.time_remaining.mins === 0 && order.time_remaining.secs === 0
                  ? null
                  : <div><p>Please note, the request will be auto-rejected in 180 seconds.</p>
                         <h1> {order.time_remaining.mins}:{order.time_remaining.secs < 10 ?  `0${order.time_remaining.secs}` : order.time_remaining.secs}</h1></div>
              }
            </div>
            <DeliveryData key={order.order_id} order_data={order} />
             <Link className="btn btn-link" to={`/delivery/${order.order_id}`}>View Delivery Details</Link>
          </div>
        ))}
      </div>
      <div>
        {deliveryData && deliveryData["accepted"].map((order) => (
          <div className="shopcards-details">
            <DeliveryData key={order.order_id} order_data={order} />
            <div className='flexbox-container'>
              <p>Is the order delivered?</p>
              <button onClick={updateOrderStatus.bind(this, order.order_id)}>Yes</button>
            </div>
             <Link className="btn btn-link" to={`/delivery/${order.order_id}`}>View Delivery Details</Link>
          </div>
        ))}
      </div>
      <div>
        {deliveryData && deliveryData["completed"].map((order) => (
          <div className="shopcards-details">
            <DeliveryData key={order.order_id} order_data={order} />
             <Link className="btn btn-link" to={`/delivery/${order.order_id}`}>View Delivery Details</Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export const DeliveryDetails = () => {
 
  const { id } = useParams()
  return <Deliveries delivery_id={id}/>

}
