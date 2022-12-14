import { useEffect, useState }from 'react'
import { useAuthContext } from "../hooks/useAuthContext"

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
  }, [])

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
        <div>
          {shops && shops.map((shop) => (
            <div className="shopcards-details" style={{float: "center"}}>
              <ShopLists key={shop._id} shops_list={shop} />
              <button onClick={handleShowMenuClick.bind(this, shop._id)}>View Menu</button>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Home