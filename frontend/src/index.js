import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store.js';
import Loading from './components/Loading.js';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
   
      {/* Render App as a fallback during the persist gate's loading phase */}
      <App />
    
  </Provider>
);

// If you'd like to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
