import logo from './logo.svg';
import './App.scss';
import './assets/scss/styles_ver1.scss';
import Navigation from './components/Navigation';
import About from './pages/About';
import Datasets from './pages/Datasets';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <>
      <Navigation />
      {/* <About/> */}
      <Datasets />
      {/* <Dashboard/> */}

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
    </>
  );
}

export default App;
