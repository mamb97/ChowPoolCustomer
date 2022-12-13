import { useState, useEffect } from "react"
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { Link } from 'react-router-dom'


import ActiveUsers from './ActiveUsers';
import {Timer} from '../hooks/useTimer'

const OrderPlacement = () => {
  const {user} = useAuthContext()
  const {menuOrderDataContext, dispatch} = useWorkoutsContext()
  const [showActiveUsers, setShowActiveUsers] = useState(false)
  const [orderTotal, setOrderTotal] = useState(0)
  const [orderConfirmationID, setOrderConfirmationID] = useState('')
  const [orderSummary, setOrderSummary] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getOrderInfo = () => {
    if(!menuOrderDataContext){
      return {}
    }
    const {shopInfo, ...orderData} = menuOrderDataContext
    
    let orderValue = 0
    let orderSummaryData = []
    for (let k in orderData){
      const ordercost = orderData[k]["qty"] * orderData[k]["item_price"]
      orderSummaryData.push({...orderData[k], "item_cost": ordercost})
      orderValue += ordercost
    }
    setOrderTotal(orderValue)
    setOrderSummary(orderSummaryData)
  }

  useEffect(() => {
    getOrderInfo()
  }, [])

  const handleOrderConfirmation = () => {
    setIsLoading(true)
    if(!user){
      setIsLoading(false)
      return
    }
    const createOrder = async () => {
      const response = await fetch('/api/order/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}`},
        body: JSON.stringify({ ...orderSummary, orderTotal, ...menuOrderDataContext["shopInfo"]})
      })
      const json = await response.json()
      if (response.ok) {
        setIsLoading(false)
        dispatch({type: 'SET_MENU_DATA', payload: {...menuOrderDataContext, "orderInfo": json}})
        setOrderConfirmationID(json.orderConfirmationID)
        setShowActiveUsers(true)

        }
    }
    createOrder()
  }

  if(showActiveUsers){
    return (
      <div>
        <div className="shopcards-details order-summary-header">
            <p><strong>Your order is now placed!!</strong></p>
            <p>Track your Order <Link className="btn btn-link" to={`/order/${orderConfirmationID}`}>Here</Link></p> 
            <p><strong>Order Confirmation ID:</strong> {orderConfirmationID}</p>
            <p><strong>Order Total:</strong> ${orderTotal}</p>
        </div>
        <div>
          <Timer message="You could request any of the other users at the restuarant to pickup your order 
                    within 10 minutes." mins={10} sec={0}/>
          <ActiveUsers/>
        </div>
      </div>
    )
  }
  else {
    return (
      <div className="order-placement-form">
        <div>
          <p><strong>Order Total:</strong> ${orderTotal}</p>
        </div>
        <div className="flexbox-container">
          <div className="shopcards-details order-summary">
            <p><strong>Order Summary</strong></p>
            <table style={{borderColor: "red", borderWidth: "2px"}}>
            {orderSummary && orderSummary.map(o => (
              <tbody key={o.item_id} className="order-summary-items flexbox-container" style={{width: "100%"}}>
                <p>{o.item_name}</p>
                <p>${o.item_price} x {o.qty}</p>
                <p style={{float: "right"}}>${o.item_cost}</p>
              </tbody>
            ))}
            </table>
          </div>          
        </div>
        <button onClick={handleOrderConfirmation} disabled={isLoading}>Confirm Order</button>
      </div>
    )
  }

}

export default OrderPlacement;