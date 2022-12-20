import { useEffect, useState }from 'react'
import { useShopsContext } from "../hooks/useShopsContext"
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

const ShopNotAvailable = () => {
  return (
      <div>
        <div className="shopcards-details">
          <h4>Oops!! There are no open shops in the area at the moment.</h4>
        </div>
      </div>
  )
}

const Home = () => {
  const {shops, dispatch} = useShopsContext()
  const {user} = useAuthContext()
  const [shopid, setShopId] = useState(null)

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

    if (user && shopid===null) {
      fetchShops()
    }
  }, [shops])

  const handleShowMenuClick = (shop_id) => {
      console.log("Button click menu", shop_id, user)
    if (!user) {
      return
    }
    setShopId(shop_id)
  }

  if(shopid != null){
    return (
      <div className='shopMenu'>
        <ShopMenu key={shopid} shop_id={shopid}/>
      </div>
    )
  }
  else if(shops && shops.length===0){ //shops could be null or []. empty list isn't considered false
    return <ShopNotAvailable key="no_shops_available"/>
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