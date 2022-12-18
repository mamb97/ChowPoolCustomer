import { useEffect }from 'react'
import { useAuthContext } from "../hooks/useAuthContext"
import {useMenuContext} from "../hooks/useMenuContext"
import MenuDetails from '../components/MenuDetails'
import MenuForm from '../components/MenuForm'
const Home = () => {
  const {menu, dispatch} = useMenuContext()
  const {user} = useAuthContext()

  useEffect(() => {
    const fetchMenu = async () => {
      console.log(user)
      const response = await fetch('/api/shop/menu', {
        headers: {'Authorization': `Bearer ${user.token}`},
        method: 'GET'
      })
      const json = await response.json()
      console.log(json)

      if (response.ok) {
        dispatch({type: 'SET_MENU', payload: json})
      }
    }

    if (user) {
      fetchMenu()
    }
  }, [dispatch, user])

  return (
      <div className="home">
        <div className="menu-container">
          {menu && menu.map((m) => (
              <MenuDetails key={m._id} ind_menu={m} />
          ))}
        </div>
        <MenuForm />
      </div>
  )
}

export default Home