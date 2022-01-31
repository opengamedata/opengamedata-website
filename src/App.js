import { Routes, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.scss';
// import './assets/scss/styles_ver1.scss';
import Navigation from './components/navigation/Navigation';
import About from './pages/About';
import Datasets from './pages/Datasets/Datasets';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <>
      <Navigation />
      <div className='App'>

        <Routes>
          <Route path="/" element={<About />} />
          <Route path="about" element={<About />} />
          <Route path="datasets" element={<Datasets />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Routes>

      </div>
    </>
  );
}

export default App;
