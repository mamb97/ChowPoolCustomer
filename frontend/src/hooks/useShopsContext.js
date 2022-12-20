import { ShopsContext } from '../context/ShopContext'
import { useContext } from 'react'

export const useShopsContext = () => {
  const context = useContext(ShopsContext)

  if (!context) {
    throw Error('useShopsContext must be used inside an ShopsContextProvider')
  }

  return context
}