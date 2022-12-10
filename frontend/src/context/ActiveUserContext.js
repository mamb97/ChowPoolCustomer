import { createContext, useReducer } from 'react'

export const WorkoutsContext = createContext()

export const workoutsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SHOPS': 
      return {
        shops: action.payload
      }
    case 'SET_MENU_DATA':
      return {
        menuOrderDataContext: action.payload,
        
      }
    case 'SET_ACTIVE_USERS':
      return {
        activeUsersDataContext: action.payload
      }
    default:
      return state
  }
}

export const WorkoutsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(workoutsReducer, {
    shops: null,
    shop: null
  })

  return (
    <WorkoutsContext.Provider value={{...state, dispatch}}>
      { children }
    </WorkoutsContext.Provider>
  )
}