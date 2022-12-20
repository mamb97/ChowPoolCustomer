import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ShopsContextProvider } from './context/ShopContext'
import { AuthContextProvider } from './context/AuthContext'
import { ActiveUserContextProvider} from './context/ActiveUserContext'
import { OrdersContextProvider } from './context/OrdersContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ShopsContextProvider>
        <ActiveUserContextProvider>
          <OrdersContextProvider>
            <App />
          </OrdersContextProvider>
        </ActiveUserContextProvider>
      </ShopsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);