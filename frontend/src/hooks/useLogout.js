import { useAuthContext } from './useAuthContext'
import { useShopsContext } from './useShopsContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  const { dispatch: dispatchShops } = useShopsContext()

  const logout = () => {
    // remove user from storage
    localStorage.removeItem('customer')

    // dispatch logout action
    dispatch({ type: 'LOGOUT' })
    dispatchShops({ type: 'SET_SHOPS', payload: null })
  }

  return { logout }
}