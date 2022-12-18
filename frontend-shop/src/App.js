import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
import "./App.css";

// pages & components
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Account from './pages/Account'
import Order from './pages/Order'
import OrderDetails from './pages/OrderDetails';

import NavbarComp from './components/Navbar';


function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <div>
         <NavbarComp />
        
        </div>
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route 
              path="/signup" 
              element={!user ? <Signup /> : <Navigate to="/" />} 
            />
            <Route
              path="/account" 
              element={user ? <Account /> : <Navigate to="/login" />} 
            />
            <Route
              path="/orders"
              element={user ? <Order /> : <Navigate to="/login" />}
            />
            <Route
              path="/order/:id"
              element={user ? <OrderDetails /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;