import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ROUTER
import { BrowserRouter } from 'react-router-dom';

// REDUX
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import authReducer from './store/reducers/auth';
import thunk from 'redux-thunk';

import { GoogleAuthProvider } from './googleAuth';


const rootReducer = combineReducers({
  auth: authReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk))


ReactDOM.render(
  <Provider store={store}>
    <GoogleAuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleAuthProvider>
  </Provider>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
