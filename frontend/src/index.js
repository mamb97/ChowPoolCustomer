import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { WorkoutsContextProvider } from './context/WorkoutContext'
import { AuthContextProvider } from './context/AuthContext'
import { ActiveUserContextProvider} from './context/ActiveUserContext'
import { OrdersContextProvider } from './context/OrdersContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <WorkoutsContextProvider>
        <ActiveUserContextProvider>
          <OrdersContextProvider>
            <App />
          </OrdersContextProvider>
        </ActiveUserContextProvider>
      </WorkoutsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);