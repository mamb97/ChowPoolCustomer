import { ActiveUsersContext } from "../context/ActiveUserContext"
import { useContext } from "react"

export const useActiveUserContext = () => {
  const context = useContext(ActiveUsersContext)

  if(!context) {
    throw Error('useActiveUserContext must be used inside an ActiveUserContextProvider')
  }

  return context
}