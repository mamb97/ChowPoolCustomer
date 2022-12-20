import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

const Navbar = () => {
  const { logout } = useLogout()
  const { user } = useAuthContext()

  const handleClick = () => {
    logout()
  }

  const homeButtonClick = () => {
    window.location.reload();
  }
  
  return (
    <header>
      <div/>
      <div className="container">
        <div>
          <Link to="/" onClick={homeButtonClick}>
            <h2>ChowPool</h2>
          </Link>
        </div>
        <nav>
          {!user && (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
          {user && (
            <div>
              <Link to="/account"><img className="navbar-icon" style={{width:"30px", height:"30px"}} src="./profile.png" alt="Profile"/></Link>
              <Link to="/orders"><img className="navbar-icon" src="./orders.png" alt="Orders"/></Link>
              <Link to="/deliveries"><img className="navbar-icon" src="./del.png" alt="Deliveries"/></Link>
            </div>
          )}
        </nav>
      </div>
      {user && (
      <div className="container">
        <nav><span>{user.email}</span></nav>
        <nav><button onClick={handleClick}>Log out</button></nav>
      </div> 
      )}
      <div/>
    </header>
  )
}

export default Navbar