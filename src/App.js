import logo from './logo.svg';
import './App.css';
import Navigation from './components/Navigation';
import About from './pages/About';
import Datasets from './pages/Datasets';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <>
      <Navigation />
      {/* <About/> */}
      <Datasets/>
      {/* <Dashboard/> */}
    </>
  );
}

export default App;
