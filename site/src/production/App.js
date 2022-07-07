import { Fragment } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.scss';
// import './assets/scss/styles_ver1.scss';
import Navigation from './components/navigation/Navigation';
import About from './pages/About/About';
// import Datasets from './pages/Datasets/Datasets';
import Dashboard from './pages/Dashboard/Dashboard';
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return React.createElement(
    Fragment,
    null,
    React.createElement(Navigation, null),
    React.createElement(
      'div',
      { className: 'App h-screen w-screen pt-12 bg-gradient-to-br from-white via-stone-50 to-stone-200' },
      React.createElement(
        'div',
        null,
        'A div inside App.js'
      ),
      React.createElement(
        Routes,
        null,
        React.createElement(Route, { path: '/', element: React.createElement(About, null) }),
        React.createElement(Route, { path: 'about', element: React.createElement(About, null) }),
        React.createElement(Route, { path: 'dashboard', element: React.createElement(Dashboard, null) }),
        React.createElement(Route, { path: '*', element: React.createElement(NotFound, null) })
      )
    )
  );
}

export default App;