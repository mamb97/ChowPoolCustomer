import { useEffect }from 'react'
import { useAuthContext } from "../hooks/useAuthContext"
import {useDeliveriesContext} from "../hooks/useDeliveriesContext";
import PendingDeliveries from "../components/PendingDeliveries";

export const Delivery = () => {
    const {user} = useAuthContext()
    const {postDeliveries, dispatch} = useDeliveriesContext()

    useEffect(() => {
        const fetchDeliveries = async () => {
            const response = await fetch('/api/delivery/pending', {
                headers: {'Authorization': `Bearer ${user.token}`},
            })
            const json = await response.json()
            if (response.ok) {
              await dispatch({type: 'SET_PENDING_DELIVERIES', payload: json})
            }
        }

        if(user){
            fetchDeliveries()
        }
    }, [dispatch, user])

    return (
        <div>
            <p><strong> Pending Deliveries </strong></p>
            <p><i>For every successfully delivery <strong>$1.00</strong> will be transferred to your payment method.</i></p>
            <div className="delivery-pending">
                {postDeliveries && postDeliveries.map((p) => (
                    <PendingDeliveries data={p} />
                )) || (<h4>Yay! No deliveries pending</h4>)}

            </div>
        </div>
    )
}