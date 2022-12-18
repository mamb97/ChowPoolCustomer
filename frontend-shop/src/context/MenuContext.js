import { createContext, useReducer } from 'react'

export const MenuContext = createContext()

export const menuReducer = (state, action) => {
    switch (action.type) {
        case 'SET_MENU':
            return {
                menu: action.payload
            }
        case 'CREATE_MENU':
            return {
                menu: [action.payload, ...state.menu]
            }
        case 'DELETE_MENU':
            return {
                menu: state.menu.filter((w) => w._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const MenuContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(menuReducer, {
        menu: null
    })

    return (
        <MenuContext.Provider value={{...state, dispatch}}>
            { children }
        </MenuContext.Provider>
    )
}