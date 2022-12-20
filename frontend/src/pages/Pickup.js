import { useEffect }from 'react'
import { useAuthContext } from "../hooks/useAuthContext"
import {useDeliveriesContext} from "../hooks/useDeliveriesContext";
import PickupRequests from "../components/PickupRequests";

export const Pickup = () => {
    const {user} = useAuthContext()
    const {postDeliveries, dispatch} = useDeliveriesContext()

    useEffect(() => {
        const fetchRequests = async () => {
            const response = await fetch('/api/delivery/incoming', {
                headers: {'Authorization': `Bearer ${user.token}`},
            })
            const json = await response.json()
            if (response.ok) {
                await dispatch({type: 'SET_INCOMING_REQUESTS', payload: json})
            }
        }
        if(user){
            fetchRequests()
        }
    }, [dispatch, postDeliveries, user])

    return (
        <div>
            <p><strong> New Pickup Requests</strong></p>
            <p><i>For every successfully delivery <strong>$1.00</strong> will be transferred to your payment method.</i></p>
                <div className="delivery-incoming">
                    <p><i>Please note, the requests will be auto-rejected in 180 seconds.</i></p>
                    {postDeliveries  && postDeliveries.map((p) => (
                        <PickupRequests data={p} />
                    )) }

                </div>

        </div>
    )
}