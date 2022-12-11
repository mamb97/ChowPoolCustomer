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
      <div className="container">
        <Link to="/" onClick={homeButtonClick}>
          <h1>ChowPool</h1>
        </Link>
        <nav>
          {!user && (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
          {user && (
            <div>
              <Link to="/account">Account</Link>
              <Link to="/orders/self">Orders</Link>
              <Link to="/orders/others">Deliveries</Link>
              <div>
              <span>{user.email}</span>
              <button onClick={handleClick}>Log out</button>
            </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar