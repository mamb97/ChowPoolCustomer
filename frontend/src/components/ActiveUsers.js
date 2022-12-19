import {useState, useEffect} from "react"

import {useWorkoutsContext} from '../hooks/useWorkoutsContext'
import {useActiveUserContext} from '../hooks/useActiveUserContext'
import {useAuthContext} from '../hooks/useAuthContext'
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
            switch (res["status"]) {
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
            body: JSON.stringify({
                'order_confirmation_id': menuOrderDataContext["orderInfo"]["orderConfirmationID"],
                'delivery': {
                    'type': 'fellow_customer',
                    'customer_details': delivery_customer
                }
            })
        })
        const json = await response.json()
    }

    const getActiveUsers = () => {
        const fetchData = async () => {
            console.log(menuOrderDataContext)
            const response = await fetch('/api/active_users/' + menuOrderDataContext.orderInfo.orderID, {
                headers: {'Authorization': `Bearer ${user.token}`},
            })
            const usersData = await response.json()
            if (response.ok) {
                for (let idx in usersData) {
                    usersData[idx]["key"] = usersData[idx]["delivery_cust_id"] + usersData[idx]["status"]
                }
                await dispatch({type: 'SET_ACTIVE_USERS', payload: usersData})
            }
        }
        if (!user) {
            return
        }

        if (!(acceptedUser || pendingUser)) {
            setIsLoading(false)
            fetchData()
        }
        if (pendingUser) {
            getUserStatus(pendingUser["customer_id"])
        }
    }

    const sendRequest = (new_cust_data) => {
        setIsLoading(true)
        setPendingUser(new_cust_data)
        // Add SMS here.
    }

    useEffect(() => {
        getActiveUsers()
    }, [activeUsersDataContext, pendingUser, dispatch])

    if (acceptedUser) {
        return (
            <div className="shopcards-details accepted-user-info">
                <p><strong>{acceptedUser.customer_name}</strong> has accepted your request to pickup the order.</p>
            </div>
        )
    } else if (pendingUser) {
        console.log(pendingUser)
        const message = <p>Waiting for <strong>{pendingUser.customer_name}</strong> to accept your pickup request.
            Please note, the request will be auto-rejected in 180 seconds.</p>
        return (
            <div className="shopcards-details accepted-user-info">
                <PendingTimer
                    message={message}
                />
            </div>
        )
    } else {
        return (
            <div>
                <i>If any of the user accepts your request an additional <strong>$1.00</strong> will be deducted from
                    your saved card. This will then be transferred to the your delivery user</i>
                <div className="shopcards-details">
                    <table style={{width: "100%"}}>
                        {activeUsersDataContext && activeUsersDataContext.map(o => (
                            <tbody key={o.customer_id}
                                   className="order-summary-items flexbox-container" style={{width: "100%"}}>
                            <tr style={{width: "100%"}}>
                                <td style={{width: "75%"}}>{o.delivery_cust_name}</td>
                                <td style={{width: "25%"}}>
                                    <button onClick={sendRequest.bind(this, o)} disabled={isLoading}>Send Request
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        ))}
                    </table>
                </div>
            </div>

        )
    }
}

export default ActiveUsers;