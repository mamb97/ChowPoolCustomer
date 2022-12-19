import { useMenuContext } from '../hooks/useMenuContext'
import { useAuthContext } from '../hooks/useAuthContext'
import {FaTrash} from "react-icons/fa";

const MenuDetails = ({ ind_menu }) => {
    const { dispatch } = useMenuContext()
    const { user } = useAuthContext()

    const handleClick = async () => {
        if (!user) {
            return
        }

        const response = await fetch('/api/shop/menu/' + ind_menu._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({type: 'DELETE_MENU', payload: json})
        }
    }

    return (
        <div className="shopcards-details">
            <div className="flexbox-container col-two">
                <h4>{ind_menu.item_name}</h4>
                <FaTrash className="material-symbols-outlined" onClick={handleClick}/>
            </div>
            <i>{ind_menu.item_description}</i>
            <p><strong>Price: </strong>${ind_menu.item_price}</p>
            <p><strong>Available? </strong>{ind_menu.availability===true ? 'Yes': 'No'}</p>

        </div>
    )
}

export default MenuDetails