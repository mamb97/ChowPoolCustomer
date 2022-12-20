import { useAuthContext } from '../hooks/useAuthContext'
import {useDeliveriesContext} from "../hooks/useDeliveriesContext";

const PendingDeliveries = ({ data }) => {
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
    const ackRequest = (order_confirmation_id) => {
        const confirm = async () => {
            const response = await fetch('/api/delivery/status', {
                headers: {'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify({order_confirmation_id})
            })
            if (response.ok) {
                dispatch({type: 'SET_PENDING_DELIVERIES', payload: formattedList(order_confirmation_id) })
            }
        }

        if (user) {
            confirm()
        }
    }

    return (
        <div className="shopcards-details">
            <p><strong>Order Confirmation ID: </strong>{data.order_confirmation_id}</p>
            <div>
                <strong>Customer Details</strong>
            </div>
            <p><strong>Name: </strong>{data.customer_name}</p>
            <p><strong>Phone: </strong>{data.customer_phone}</p>
            <p><strong>Address: </strong>{data.customer_address}</p>
            <i>Approximately {data.distance} (in meters) from your destination</i>
            <p>Shop Name: {data.shop_name}</p>
            <p>Shop Address: {data.shop_address}</p>
            <button onClick={ackRequest.bind(this, data.order_confirmation_id)}>Click this button when the order is delivered</button>
        </div>
    )
}

export default PendingDeliveries