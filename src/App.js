import { Routes, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.scss';
import './assets/scss/styles_ver1.scss';
import Navigation from './components/Navigation';
import About from './pages/About';
import Datasets from './pages/Datasets';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className='App'>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="datasets" element={<Datasets />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>

      {/* <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div> */}
    </div>
  );
}

function Home() {
  return (
    <>
      <main>
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
        <p>You can do this, I believe in you.</p>
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
      </main>
      <nav>
        <Link to="/about">About</Link>
      </nav>
    </>
  );
}

export default App;
