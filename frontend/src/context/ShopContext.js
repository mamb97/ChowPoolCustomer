import { createContext, useReducer } from 'react'

export const ShopsContext = createContext()

export const shopsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SHOPS': 
      return {
        shops: action.payload
      }
    case 'SET_MENU_DATA':
      return {
        menuOrderDataContext: action.payload,
      }
    default:
      return state
  }
}

export const ShopsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(shopsReducer, {
    shops: null
  })

  return (
    <ShopsContext.Provider value={{...state, dispatch}}>
      { children }
    </ShopsContext.Provider>
  )
}