import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSave = () => {
  const { user } = useAuthContext()
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const saveAccountDetails = async (email, password, name, phone, unitNumber, streetAddress,
    city, state, zipcode, delivery_optout, payment_method) => {
    setIsLoading(true)
    setError(null)
    
    const response = await fetch('/api/account', {
      method: 'POST',
      headers: {'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`},
      body: JSON.stringify({ email, password, name, phone, unitNumber, streetAddress,
        city, state, zipcode, delivery_optout, payment_method })
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      alert("User Details Successfully Saved")
      // // update the auth context
      dispatch({type: 'SAVE_ACCOUNT', payload: json})

      // update loading state
      setIsLoading(false)
    }
  }

  return { saveAccountDetails, isLoading, error }
}