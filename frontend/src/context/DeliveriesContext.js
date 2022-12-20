import { createContext, useReducer } from 'react'

export const DeliveriesContext = createContext()

export const postDeliveriesContextReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PENDING_DELIVERIES':
      return {
        postDeliveries: action.payload
      }
    case 'SET_INCOMING_REQUESTS':
      return {
        postDeliveries: action.payload
      }
    default:
      return state
  }
}

export const DeliveriesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postDeliveriesContextReducer, {
    postDeliveries: null
  })

  return (
    <DeliveriesContext.Provider value={{...state, dispatch}}>
      { children }
    </DeliveriesContext.Provider>
  )
}