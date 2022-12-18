import { useEffect, useState }from 'react'
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from "../hooks/useAuthContext"

import ShopMenu from '../components/ShopMenu'

const ShopData = ({ shop_data }) => {
  return (
      <div>
        <div>
          <h4>{shop_data.shop_name}</h4>
          <p><strong>Address: </strong>{shop_data.address}</p>
        </div>
        <div>
          <p><strong>Contact Phone: </strong>{shop_data.phone}</p>
          <p><strong>Distance: </strong>{shop_data.distance} KM</p>
          <p><strong>Open: </strong>{shop_data.open}</p>
          <p><strong>Close: </strong>{shop_data.close}</p>
        </div>
      </div>
  )
}

const Home = () => {
  const {shops, dispatch} = useWorkoutsContext()
  const {user} = useAuthContext()
  const [shopid, setShopId] = useState(0)  

  useEffect(() => {
    const fetchShops = async () => {
      const response = await fetch('/api/shops', {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()
      if (response.ok) {
        dispatch({type: 'SET_SHOPS', payload: json})
      }
    }

    if (user) {
      fetchShops()
    }
  }, [shops])

  const handleShowMenuClick = (shop_id) => {
    if (!user) {
      return
    }
    setShopId(shop_id)
  }

  if(shopid > 0){
    return (
      <div className='shopMenu'>
        <ShopMenu key={shopid} shop_id={shopid}/>
      </div>
    )
  }
  else {
    return (
      <div className="home">
        <div/>
        <div className="menu-container">
          {shops && shops.map((shop) => (
            <div className="shopcards-details" >
              <ShopData key={`${shop.shop_id}_${shop.shop_name}`} shop_data={shop} />
              <button onClick={handleShowMenuClick.bind(this, shop.shop_id)}>View Menu</button>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Home