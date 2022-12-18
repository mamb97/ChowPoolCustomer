import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSave = () => {
  const { user } = useAuthContext()
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const saveAccountDetails = async (email, name, phone, unitNumber, streetAddress, city, state, zipcode,
    startTime, endTime, openDays) => {
    setIsLoading(true)
    setError(null)
    
    const response = await fetch('/api/shop/account', {
      method: 'POST',
      headers: {'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`},
      body: JSON.stringify({ email, name, phone, unitNumber, streetAddress, city, state, zipcode,
        startTime, endTime, openDays })
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      alert("Shop Details Successfully Saved")
      // // update the auth context
      dispatch({type: 'SAVE_ACCOUNT', payload: json})

      // update loading state
      setIsLoading(false)
    }
  }

  return { saveAccountDetails, isLoading, error }
}