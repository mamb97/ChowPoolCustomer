import {useState} from 'react'
import {useAuthContext} from './useAuthContext'

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()

    const signup = async (email, password, name, phone, unitNumber, streetAddress, city, state, zipcode,
                          startTime, endTime, openDays) => {
        setIsLoading(true)
        setError(null)
        console.log(openDays, startTime, endTime)
        const response = await fetch('/api/shop/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password, name, phone, unitNumber, streetAddress, city, state, zipcode,
            startTime, endTime, openDays})
        })
        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if (response.ok) {
            // save the user to local storage
            localStorage.setItem('shop', JSON.stringify(json))

            // update the auth context
            dispatch({type: 'LOGIN', payload: json})

            // update loading state
            setIsLoading(false)
        }
    }

    return {signup, isLoading, error}
}