import { useState, useEffect } from "react"
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'


const ShopMenu = ({shop_id}) => {
  const {user} = useAuthContext()
  const [showActiveUsers, setShowActiveUsers] = useState(false)
  const [showPlaceOrder, setShowPlaceOrder] = useState(false)
  const [shopData, setShopData] = useState('')
  const [menuOrderData, setMenuOrderData] = useState('')
  const {menuOrderDataContext, dispatch} = useWorkoutsContext()


  useEffect(() => {
    const fetchShopData = async () => {
      const response = await fetch("http://localhost:4000/api/shop/" + shop_id, {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()
      if(response.ok){
        setShopData(json)
      }
    }

    if (user) {
      fetchShopData()
    }
  }, [menuOrderDataContext, dispatch])

  const getMenuItemData = (menu_item_id) => {
    if(!shopData){
      return {}
    }
    for(let k in shopData["menu"]){
      if(k.item_id == menu_item_id){
        return k
      }
    }
    return {}
  }

  const updateItemQuantity = (item_id, qty) => {
    if(!shopData){
      return 
    }
    let m = menuOrderDataContext || {}
    if(!(item_id in m)){
      m[item_id] = {...getMenuItemData(item_id), 'qty': 0}
    }
    if(m[item_id]['qty'] <=0 && qty == -1){
      return
    }
    m[item_id]['qty'] += qty
    setMenuOrderData(m)
    dispatch({type: 'SET_MENU_DATA', payload: m})
  }

  if(shopData){
    return (
      <div className="shop-menu">
          <div className="shopcards-details">
            <h1>{shopData.shop_name}</h1>
            <p> Address: {shopData.shop_address}</p>
            <div>
              <p className="col-sm-3">Open Time: {shopData.shop_open}</p>
              <p className="col-sm-3">Close Time: {shopData.shop_close}</p>
            </div>
            <div>
              <button>Place Order</button>
            </div>
          </div>          
          <div>
          {shopData.menu && shopData.menu.map((menu_item) => (
            <table className="shopcards-details flexbox-container">
              <tbody key={menu_item.item_id} style={{width: "100%"}}>
                <td style={{width: "50%"}}>
                  <div>
                    <p>{menu_item.item_name}</p>
                    <p>{menu_item.item_description}</p>
                  </div>
                </td>
                <td style={{width: "100%"}}>
                  <div>
                    <p>${menu_item.item_price}</p>
                  </div>
                </td>
                <td style={{width: "100%"}}>
                  <button onClick={updateItemQuantity.bind(this, menu_item.item_id, 1)}>+</button>
                  <p>{menuOrderDataContext && menuOrderDataContext[menu_item.item_id] && menuOrderDataContext[menu_item.item_id]["qty"] || 0}</p>
                  <button onClick={updateItemQuantity.bind(this, menu_item.item_id, -1)}>-</button>
                </td>
              </tbody>
            </table>
          ))}
        </div>
      </div>
    )
  }
}

export default ShopMenu;