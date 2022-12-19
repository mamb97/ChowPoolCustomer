import { useState } from "react"
import { useMenuContext } from "../hooks/useMenuContext"
import { useAuthContext } from '../hooks/useAuthContext'

const MenuForm = () => {
    const { dispatch } = useMenuContext()
    const { user } = useAuthContext()

    const [itemName, setItemName] = useState('')
    const [itemDesc, setItemDesc] = useState('')
    const [itemPrice, setItemPrice] = useState('')
    const [availability, setAvailability] = useState(true)

    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in')
            return
        }

        const menu = {itemName, itemDesc, itemPrice, availability}

        const response = await fetch('/api/shop/menu', {
            method: 'POST',
            body: JSON.stringify(menu),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
        }
        if (response.ok) {
            setItemName('')
            setItemDesc('')
            setItemPrice('')
            setAvailability(true)
            dispatch({type: 'CREATE_MENU', payload: json})
        }
    }

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a New Menu Item</h3>

            <label>Item Name:</label>
            <input
                type="text"
                onChange={(e) => setItemName(e.target.value)}
                value={itemName}
                required
            />

            <label>Item Description:</label>
            <input
                type="text"
                onChange={(e) => setItemDesc(e.target.value)}
                value={itemDesc}
                required
            />

            <label>Item Price:</label>
            <input
                type="text"
                onChange={(e) => setItemPrice(e.target.value)}
                value={itemPrice}
                required
            />
            <label> Is Available?
            <input type="checkbox"
                   defaultChecked={availability}
                   onChange={(e) => setAvailability(e.target.checked)}/></label>
            <button>Add Menu</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default MenuForm