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
import {Delivery} from './pages/Delivery';
import NavbarComp from './components/Navbar';
import {Pickup} from "./pages/Pickup";


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
            <Route
                path="/pending-deliveries"
                element={user ? <Delivery /> : <Navigate to="/login" />}
            />
            <Route
                path="/pickup-requests"
                element={user ? <Pickup /> : <Navigate to="/login" />}
            />
            {/*<Route */}
            {/*  path="/deliveries" */}
            {/*  element={user ? <Deliveries /> : <Navigate to="/login" />} */}
            {/*/>*/}
            {/*<Route */}
            {/*  path="/delivery/:id" */}
            {/*  element={user ? <DeliveryDetails /> : <Navigate to="/login" />} */}
            {/*/>*/}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
