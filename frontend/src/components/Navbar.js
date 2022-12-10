import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

const Navbar = () => {
  const { logout } = useLogout()
  const { user } = useAuthContext()

  const handleClick = () => {
    logout()
  }

  return (
    <header>
      <div className="container">
        <Link to="/">
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
              {/* <Link to="/orders">Orders</Link> */}
              <Link to="/account">Account</Link>
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