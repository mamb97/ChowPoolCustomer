import { useState, useEffect } from "react"
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'


const OrderPlacement = ({shop_id}) => {
  const {user} = useAuthContext()
  const {menuOrderDataContext, activeUsersDataContext, dispatch} = useWorkoutsContext()
  // const {activeUsersDataContext} = useWorkoutsContext()

  const [showConfirmOrderButton, setShowConfirmOrderButton] = useState(false)
  const [showActiveUsers, setShowActiveUsers] = useState(false)
  const [orderTotal, setOrderTotal] = useState(0)
  const [orderPickupType, setOrderPickupType] = useState('self')

  useEffect(() => {
    console.log(menuOrderDataContext)
    dispatch({type: 'SET_ACTIVE_USERS', payload: {'active_users': [1,2,3]}})
    console.log(activeUsersDataContext)
  }, [])

  //dispatch({type: 'SET_ACTIVE_USERS', payload: {'active_users': [1,2,3]}})


return (
  "Hello World"
)
}

export default OrderPlacement;