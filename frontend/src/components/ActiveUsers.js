
// Original version
import { useState, useEffect } from "react"

import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useActiveUserContext } from '../hooks/useActiveUserContext'
import { useAuthContext } from '../hooks/useAuthContext'
import {Timer} from '../hooks/useTimer'
import {PendingTimer} from '../hooks/usePendingTimer';


const ActiveUsers = ({user_status}) => {
    const {user} = useAuthContext()
    const {menuOrderDataContext} = useWorkoutsContext()
    const {activeUsersDataContext, dispatch} = useActiveUserContext()
    const [acceptedUser, setAcceptedUser] = useState(false)
    const [pendingUser, setPendingUser] = useState(false)
    const [isLoading, setIsLoading] = useState(null)

    
    const getUserStatus = async (user_id) => {
        console.log("UserID: " + user_id)
        const response = await fetch('/api/user_pickup_status', {
            headers: {'Authorization': `Bearer ${user.token}`},
            method: 'POST',
            body: {"pickup_user_id": user_id},
          })
          const res = await response.json()
          if (response.ok) {
            console.log(res["status"])
            switch(res["status"]){
                case "accepted": {
                    setIsLoading(false)
                    
                    setAcceptedUser(pendingUser)
                    setPendingUser(false)
                    updateOrder(acceptedUser)
                    break
                }
                case "rejected": {
                    // Send Push Notifications
                    setIsLoading(false)
                    
                    window.alert("Oops!! " + pendingUser["customer_name"] + " has rejected your pickup request.")
                    setPendingUser(false)
                    break
                }
            }
          }
    }

    const updateOrder = async (delivery_customer) => {
        const response = await fetch('/api/order/update_delivery_type', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}`},
            body: JSON.stringify({ 'order_confirmation_id': menuOrderDataContext["orderInfo"]["orderConfirmationID"] ,
                                   'delivery': {
                                    'type': 'fellow_customer',
                                    'customer_details': delivery_customer
                                   }
                                })
            })  
        const json = await response.json()
    }
    
    const getActiveUsers = () => {
        console.log("GET ACTIVE USERS METHOD CALLED")

        const fetchData = async () => {
            const {shopInfo, ...orderData} = menuOrderDataContext
            
            const response = await fetch('/api/active_users/'+shopInfo["_id"], {
            headers: {'Authorization': `Bearer ${user.token}`},
            })
            const usersData = await response.json()
            if (response.ok) {
                for(let idx in usersData){
                    usersData[idx]["key"] = usersData[idx]["customer_id"] + usersData[idx]["status"]
                }
                dispatch({type: 'SET_ACTIVE_USERS', payload: usersData})
            }
        }
        if(!user){
            return
        }
        
        if(!(acceptedUser || pendingUser)){
            setIsLoading(false)
            fetchData()
        }
        if (pendingUser){
            getUserStatus(pendingUser["customer_id"])
        }
    }

    const sendRequest = (new_cust_data) => {
        setIsLoading(true)
        // this.setState({pendingUser: new_cust_data}, () => {
        //     console.log("Pending User", pendingUser)
        // })
        setPendingUser(new_cust_data)
        // console.log("Pending User", pendingUser, new_cust_data)
        // getUserStatus(new_cust_data["customer_id"])
        // console.log("Sending Request to", new_cust_data)

    }

    useEffect(() => {
        getActiveUsers()
    }, [activeUsersDataContext, pendingUser, dispatch])

    if(acceptedUser){
        return(
        <div className="shopcards-details accepted-user-info">
            <p><strong>{acceptedUser.customer_name}</strong> has accepted your request to pickup the order.</p>
        </div>
        )
    }
    else if(pendingUser){
        console.log(pendingUser)
        const message = <p>Waiting for <strong>{pendingUser.customer_name}</strong> to accept your pickup request. 
        Please note, the request will be auto-rejected in 180 seconds.</p>
        return(
            <div className="shopcards-details accepted-user-info">
                 <PendingTimer 
                        message={message}
                />
            </div>
            )
    }
    else{
        return (
            <div>
                {/* <Timer message="You could request any of the other users at the restuarant to pickup your order 
                    within 10 minutes." mins={10} sec={0}/> */}
                <div>
                    <table>
                    {activeUsersDataContext && activeUsersDataContext.map(o => (
                        <tbody key={o.customer_id} className="order-summary-items shopcards-details flexbox-container" style={{width: "100%"}}>
                            <tr>{o.customer_name}</tr>
                            <button onClick={sendRequest.bind(this, o)} 
                                    disabled={isLoading}>Send Request</button>
                        </tbody>
                    ))}
                    </table>
                </div>
            </div>
            
        )
    }
}

export default ActiveUsers;