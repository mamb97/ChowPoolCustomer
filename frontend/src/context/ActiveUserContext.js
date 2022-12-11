import { createContext, useReducer } from 'react'

export const ActiveUsersContext = createContext()

export const activeUserReducer = (state, action) => {
  switch (action.type) {
    
    case 'SET_ACTIVE_USERS':
      return {
        activeUsersDataContext: action.payload
      }
    default:
      return state
  }
}

export const ActiveUserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(activeUserReducer, {
    shops_n:null
  })

  return (
    <ActiveUsersContext.Provider value={{...state, dispatch}}>
      { children }
    </ActiveUsersContext.Provider>
  )
}