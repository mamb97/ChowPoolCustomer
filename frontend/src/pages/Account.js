import { useAuthContext } from '../hooks/useAuthContext'
import {useSave} from '../hooks/useSave'
import { useState, useEffect } from "react"

const Account = () => {
  const { user } = useAuthContext()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [payment_method, setPaymentMethod] = useState('')
  const [delivery_optout, setDeliveryOptOut] = useState('')
  const [unitNumber, setUnitNumber] = useState('')
  const [houseNumber, setHouseNumber] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipcode, setZipcode] = useState('')
  const {saveAccountDetails, error, isLoading} = useSave()

  useEffect(() => {
    async function fetchData(){
    const response = await fetch('http://localhost:4000/api/account/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    
    const json = await response.json()
    console.log(json)
    setName(json.name)
    setEmail(json.email)
    setPassword(json.password)
    setPhone(json.phone)
    setPaymentMethod(json.payment_method)
    setDeliveryOptOut(json.delivery_optout)
    setUnitNumber(json.unitNumber)
    setHouseNumber(json.houseNumber)
    setStreet(json.street)
    setCity(json.city)
    setState(json.state)
    setZipcode(json.zipcode)
    return json
  }
  fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    await saveAccountDetails(email, password, name, phone, unitNumber, houseNumber, 
      street, city, state, zipcode, delivery_optout, payment_method)
    
  }

  return (
    <form className="account-details" onSubmit={handleSubmit} 
          >
      <h3>Account Details</h3>
      <label>Name:</label>
      <input 
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <label>Email address:</label>
      <input 
        type="email"
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        required
        readOnly={true}
      />
      <label>Password:</label>
      <input 
        type="password"
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        required
        readOnly={true}
      />
      <label>Phone:</label>
      <input 
        type="Number"
        value={phone}
        required
        onChange={(e) => setPhone(e.target.value)}
         
      />
      <label>Payment Method:</label>
      <input 
        type="text"
        required
        readOnly={true}
        value={payment_method}
      />
      <label>Delivery OptOut:</label>
      <select 
        required
        onChange={(e) => setDeliveryOptOut(e.target.value)}
        value={delivery_optout}
        >
        
        <option value="1">Yes</option>
        <option value="0">No</option>
      </select>
      
      <label>Unit Number:</label>
      <input 
        type="text"        
        value={unitNumber}
        onChange={(e) => setUnitNumber(e.target.value)}
      />
      <label>Street Number:</label>
      <input 
        type="text"
        onChange={(e) => setHouseNumber(e.target.value)}
        value={houseNumber}
        required
      />
      <label>Street Name:</label>
      <input 
        type="text"
        onChange={(e) => setStreet(e.target.value)}
        value={street}
        required
      />
      <label>City:</label>
      <input 
        type="text"
        onChange={(e) => setCity(e.target.value)}
        value={city}
        required
      />
      <label>State:</label>
      <select 
        required
        onChange={(e) => setState(e.target.value)}
        value={state}
        >
        
        <option value="AL">Alabama</option>
        <option value="AK">Alaska</option>
        <option value="AZ">Arizona</option>
        <option value="AR">Arkansas</option>
        <option value="CA">California</option>
        <option value="CO">Colorado</option>
        <option value="CT">Connecticut</option>
        <option value="DE">Delaware</option>
        <option value="DC">District Of Columbia</option>
        <option value="FL">Florida</option>
        <option value="GA">Georgia</option>
        <option value="HI">Hawaii</option>
        <option value="ID">Idaho</option>
        <option value="IL">Illinois</option>
        <option value="IN">Indiana</option>
        <option value="IA">Iowa</option>
        <option value="KS">Kansas</option>
        <option value="KY">Kentucky</option>
        <option value="LA">Louisiana</option>
        <option value="ME">Maine</option>
        <option value="MD">Maryland</option>
        <option value="MA">Massachusetts</option>
        <option value="MI">Michigan</option>
        <option value="MN">Minnesota</option>
        <option value="MS">Mississippi</option>
        <option value="MO">Missouri</option>
        <option value="MT">Montana</option>
        <option value="NE">Nebraska</option>
        <option value="NV">Nevada</option>
        <option value="NH">New Hampshire</option>
        <option value="NJ">New Jersey</option>
        <option value="NM">New Mexico</option>
        <option value="NY">New York</option>
        <option value="NC">North Carolina</option>
        <option value="ND">North Dakota</option>
        <option value="OH">Ohio</option>
        <option value="OK">Oklahoma</option>
        <option value="OR">Oregon</option>
        <option value="PA">Pennsylvania</option>
        <option value="RI">Rhode Island</option>
        <option value="SC">South Carolina</option>
        <option value="SD">South Dakota</option>
        <option value="TN">Tennessee</option>
        <option value="TX">Texas</option>
        <option value="UT">Utah</option>
        <option value="VT">Vermont</option>
        <option value="VA">Virginia</option>
        <option value="WA">Washington</option>
        <option value="WV">West Virginia</option>
        <option value="WI">Wisconsin</option>
        <option value="WY">Wyoming</option>
    
        
        </select>
      <label>ZipCode:</label>
      <input 
        type="text"
        onChange={(e) => setZipcode(e.target.value)}
        value={zipcode}
        required
      />
      
      <button disabled={isLoading}>Save</button>
      {error && <div className="error">{error}</div>}
    </form>
  ) 
}


export default Account

