import { DeliveriesContext } from "../context/DeliveriesContext"
import { useContext } from "react"

export const useDeliveriesContext = () => {
  const context = useContext(DeliveriesContext)

  if(!context) {
    throw Error('useDeliveriesContext must be used inside an DeliveriesContextProvider')
  }

  return context
}