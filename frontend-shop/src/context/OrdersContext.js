import { createContext, useReducer } from 'react'

export const OrdersContext = createContext()

export const ordersContextReducer = (state, action) => {
  switch (action.type) {
    
    case 'SET_ORDERS':
      return {
        orders: action.payload
      }
    default:
      return state
  }
}

export const OrdersContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ordersContextReducer, {
    orders:null
  })

  return (
    <OrdersContext.Provider value={{...state, dispatch}}>
      { children }
    </OrdersContext.Provider>
  )
}