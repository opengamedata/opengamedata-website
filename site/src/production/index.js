// import React from 'react';
// import ReactDOM from 'react-dom';
// import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';

var root_elem = document.getElementById('dashroot');
console.log('starting to run index.js, root element is ' + root_elem);
ReactDOM.render(React.createElement(
  React.StrictMode,
  null,
  React.createElement(
    'div',
    null,
    'A div in index.js'
  )
), root_elem);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
console.log('ran index.js');