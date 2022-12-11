import { useState, useEffect } from "react"
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useActiveUserContext } from '../hooks/useActiveUserContext'
import { useAuthContext } from '../hooks/useAuthContext'
import {Timer} from '../hooks/useTimer'


const AcceptedRequest = (user_data) => {
    // <div className="shopcards-details accepted-request-info">
    // <table>
    //   {activeUsersDataContext && activeUsersDataContext.map(o => (
    //     <tbody key={o.item_id} className="order-summary-items flexbox-container" style={{width: "100%"}}>
    //       <p>{o.item_name}</p>
    //       <p>${o.item_price} x {o.qty}</p>
    //       <p style={{float: "right"}}>${o.item_cost}</p>
    //     </tbody>
    //   ))}
    //   </table>
    // </div>
}

const PendingRequest = () => {

}

const ActiveUsers = ({user_status}) => {
    const {user} = useAuthContext()
    const {menuOrderDataContext} = useWorkoutsContext()
    const {activeUsersDataContext, dispatch} = useActiveUserContext()
    const [acceptedUser, setAcceptedUser] = useState(false)
    const [pendingUser, setPendingUser] = useState(false)
    const [isLoading, setIsLoading] = useState(null)

    const getUserStatus = async (user_id) => {
        console.log("UserID: " + user_id)
        const response = await fetch('http://localhost:4000/api/user_pickup_status', {
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
                    updateOrder(acceptedUser.customer_id)
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

    const updateOrder = () => {

    }
    
    const getActiveUsers = () => {

        const fetchData = async () => {
            const {shopInfo, ...orderData} = menuOrderDataContext
            
            const response = await fetch('http://localhost:4000/api/active_users/'+shopInfo["_id"], {
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
        setPendingUser(new_cust_data)

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
        const message = <p>Waiting for {<strong>pendingUser.customer_name</strong>} to accept your pickup request. 
        Please note, the request will be auto-rejected in 180 seconds.</p>
        return(
            <div className="shopcards-details accepted-user-info">
                 <Timer mins="2" sec="30"
                        message={message}
                />
            </div>
            )
    }
    else{
        return (
            <div>
                <Timer message="You could request any of the other users at the restuarant to pickup your order 
                    within 10 minutes."/>
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