import { useAuthContext } from '../hooks/useAuthContext'
import {useDeliveriesContext} from "../hooks/useDeliveriesContext";

const PickupRequests = ({ data }) => {
    const {postDeliveries, dispatch} = useDeliveriesContext()
    const { user } = useAuthContext()

    const formattedList = (order_confirmation_id) => {
        if(postDeliveries && postDeliveries.length > 0) {
            const idx = postDeliveries.findIndex(object => {
                return object.order_confirmation_id === order_confirmation_id;
            });
            postDeliveries.splice(idx, 1);
        }
        return postDeliveries
    }
    const ackRequest = (order_confirmation_id, status) => {
        const confirm = async () => {
            const response = await fetch('/api/delivery/ack', {
                headers: {'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify({order_confirmation_id, status})
            })
            if (response.ok) {
                dispatch({type: 'SET_INCOMING_REQUESTS', payload: formattedList(order_confirmation_id) })
            }
        }

        if (user) {
            confirm()
        }

    }

    return (
        <div className="shopcards-details">
            <p><strong>{data.customer_name}</strong> is requesting you to pickup the order.</p>
            <p>Delivery location is approx. <strong>{data.distance}(in meters)</strong> from your destination.</p>
            <p>Shop Name: {data.shop_name}</p>
            <p>Shop Address: {data.shop_address}</p>
            <div className='flexbox-container' style={{width: "100%"}}>
                <button style={{width: "50%"}} onClick={ackRequest.bind(this, data.order_confirmation_id, "accepted")}>Accept</button>
                <button style={{width: "50%"}} onClick={ackRequest.bind(this, data.order_confirmation_id, "rejected")}>Reject</button>
            </div>


        </div>
    )
}

export default PickupRequests