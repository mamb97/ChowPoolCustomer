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
            <div >
              <Link to="/account"><button >Profile</button></Link>
              <Link to="/orders"><button>Orders</button></Link>
              <Link to="/pending-deliveries"><button>Deliveries</button></Link>
              <Link to="/pickup-requests"><button>Pickup Requests</button></Link>
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