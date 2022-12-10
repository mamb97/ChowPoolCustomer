import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const ShopLists = ({ shops_list }) => {
  const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()

  return (
    <div className="shopcards-details">
      <h4>{shops_list.shop_img}</h4>
      <p><strong>Shop Name : </strong>{shops_list.shop_name}</p>
      <p><strong>Shop Open: </strong>{shops_list.shop_open}</p>
      <p><strong>Shop Close: </strong>{shops_list.shop_close}</p>
      
    </div>
  )
}

export default ShopLists