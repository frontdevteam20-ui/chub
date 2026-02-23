import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import emailjs from 'emailjs-com';
import { store, persistor } from './store/store';

// import './index.css'
import App from './App.jsx'

// EmailJS SDK initialization
window.emailjs = emailjs;
window.emailjs.init('u22Yg0aen65MkLSXw'); // publicKey from EMAIL_CONFIG

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
)