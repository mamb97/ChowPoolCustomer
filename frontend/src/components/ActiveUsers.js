import {useState, useEffect} from "react"

import {useShopsContext} from '../hooks/useShopsContext'
import {useActiveUserContext} from '../hooks/useActiveUserContext'
import {useAuthContext} from '../hooks/useAuthContext'
import {PendingTimer} from '../hooks/usePendingTimer';

const ActiveUsers = () => {
    const {user} = useAuthContext()
    const {menuOrderDataContext} = useShopsContext()
    const {activeUsersDataContext, dispatch} = useActiveUserContext()
    const [acceptedUser, setAcceptedUser] = useState(false)
    const [pendingUser, setPendingUser] = useState(false)
    const [isLoading, setIsLoading] = useState(null)

    const sendRequest = async (new_cust_data) => {
        console.log('New Cust Data', new_cust_data)
        setIsLoading(true)
        await setPendingUser(new_cust_data)
        const fetchData = async () => {
            const response = await fetch('/api/delivery/request/send', {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(new_cust_data)
            })
            const res = await response.json()

            if (response.ok) {
                console.log("Status", res["status"])
                switch (res["status"]) {
                    case "accepted": {
                        setIsLoading(false)
                        await setAcceptedUser(true)
                        await setPendingUser(false)
                        break
                    }
                    case "rejected": {
                        setIsLoading(false)
                        // window.alert("Oops!! " + pendingUser["delivery_cust_name"] + " has rejected your pickup request.")
                        await setPendingUser(false)
                        break
                    }
                }
            }
        }
        await fetchData()
    }

    useEffect(() => {
        const fetchData = async () => {
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

        if (user && (!(acceptedUser || pendingUser))) {
            console.log("ACTIVE USERS CALL")
            setIsLoading(false)
            fetchData()
        }
    }, [activeUsersDataContext, dispatch, pendingUser])

    if (acceptedUser) {
        return (
            <div className="shopcards-details accepted-user-info">
                <p>Your order pickup request has been accepted. Goto Orders page to track your order</p>
            </div>
        )
    } else if (pendingUser) {
        const message = <p>Waiting for <strong>{pendingUser.delivery_cust_name}</strong> to accept your pickup request.
            Please note, the request will be auto-rejected in 150 seconds.</p>
        return (
            <div className="shopcards-details accepted-user-info">
                <PendingTimer message={message}
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
                    {(!activeUsersDataContext || activeUsersDataContext.length===0) && (
                        <div><h4>Oops!! There are no active users from your locality at the shop right now.</h4></div>
                    )}

                </div>
            </div>

        )
    }
}

export default ActiveUsers;