import {useState} from "react"
import {useSignup} from "../hooks/useSignup"

const Signup = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [unitNumber, setUnitNumber] = useState('')
    const [streetAddress, setStreetAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zipcode, setZipcode] = useState('')
    const [startTime, setStartTime] = useState('00:00')
    const [endTime, setEndTime] = useState('23:59')
    const [startTimeColor, setStartTimeColor] = useState('#bfa')
    const [endTimeColor, setEndTimeColor] = useState('#bfa')
    const [u, setU] = useState(true)
    const [m, setM] = useState(true)
    const [t, setT] = useState(true)
    const [w, setW] = useState(true)
    const [r, setR] = useState(true)
    const [f, setF] = useState(true)
    const [s, setS] = useState(true)
    const {signup, error, isLoading} = useSignup()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await signup(email, password, name, phone, unitNumber, streetAddress, city, state, zipcode,
            startTime, endTime, [u, m, t, w, r, f, s])
    }

    function validateHhMm(inputField, setMethod, setTimeFieldColor) {
        const isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(inputField.target.value);
        if (isValid) {
            setMethod(inputField.target.value)
            setTimeFieldColor('#bfa')
        } else {
            setMethod(inputField.target.value)
            setTimeFieldColor('#fba')
        }

        return isValid;
    }


    return (
        <form className="signup" onSubmit={handleSubmit} style={{width: "100%"}}>
            <h3>Shop Sign Up</h3>
            <div className="flexbox-container">
                <p>Name:</p>
                <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                />
            </div>
            <div className="flexbox-container">
                <p>Email:</p>
                <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />
            </div>
            <div className="flexbox-container">
                <p>Password:</p>
                <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                /></div>
            <div className="flexbox-container">
                <p>Phone:</p>
                <input
                    type="Number"
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone}
                    required
                /></div>
            <div className="flexbox-container">
                <p>Unit Number:</p>
                <input
                    type="text"
                    onChange={(e) => setUnitNumber(e.target.value)}
                    value={unitNumber}
                /></div>
            <div className="flexbox-container">
                <p>Street Address:</p>
                <input
                    type="text"
                    onChange={(e) => setStreetAddress(e.target.value)}
                    value={streetAddress}
                    required
                /></div>
            <div className="flexbox-container">
                <p>City:</p>
                <input
                    type="text"
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                    required
                /></div>
            <div className="flexbox-container">
                <p>State:</p>
                <select
                    required
                    onChange={(e) => setState(e.target.value)}
                    value={state}>

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


                </select></div>
            <div className="flexbox-container">
                <p>ZipCode:</p>
                <input
                    type="text"
                    onChange={(e) => setZipcode(e.target.value)}
                    value={zipcode}
                    required
                /></div>
            <div className="flexbox-container">
                <div className="flexbox-container">
                    <p>Start Time: </p>
                    <input
                        type="text"
                        style={{backgroundColor: startTimeColor}}
                        onChange={(e) => validateHhMm(e, setStartTime, setStartTimeColor)}
                        value={startTime}
                        required
                    />
                </div>
                <div className="flexbox-container">
                    <p>End Time: </p>
                    <input
                        type="text"
                        style={{backgroundColor: endTimeColor}}
                        onChange={(e) => validateHhMm(e, setEndTime, setEndTimeColor)}
                        value={endTime}
                        required
                    />
                </div>
            </div>
            <div className="flexbox-container">
                <label>OpenDays: </label>
                <div>
                    <div className="flexbox-container">
                        <p>Monday</p>
                        <input type="checkbox"
                               defaultChecked={m}
                               onChange={(e) => setM(e.target.checked)}/>
                    </div>
                    <div className="flexbox-container">
                        <p>Tuesday</p>
                        <input type="checkbox"
                               defaultChecked={t}
                               onChange={(e) => {setT(e.target.checked)
                               console.log(e.target.checked)}}/>
                    </div>
                    <div className="flexbox-container">
                        <p>Wednesday</p>
                        <input type="checkbox"
                               defaultChecked={w}
                               onChange={(e) => setW(e.target.checked)}/>
                    </div>
                    <div className="flexbox-container">
                        <p>Thursday</p>
                        <input type="checkbox"
                               defaultChecked={r}
                               onChange={(e) => setR(e.target.checked)}/>
                    </div>
                    <div className="flexbox-container">
                        <p>Friday</p>
                        <input type="checkbox"
                               defaultChecked={f}
                               onChange={(e) => setF(e.target.checked)}/>

                    </div>
                    <div className="flexbox-container">
                        <p>Saturday</p>
                        <input type="checkbox"
                               defaultChecked={s}
                               onChange={(e) => setS(e.target.checked)}/>

                    </div>
                    <div className="flexbox-container">
                        <p>Sunday</p>
                        <input type="checkbox"
                               defaultChecked={u}
                               onChange={(e) => setU(e.target.checked)}/>

                    </div>
                </div>
            </div>
            <button disabled={isLoading}>Sign up</button>
            {
                error && <div className="error">{error}</div>
            }
        </form>
    )
}

export default Signup