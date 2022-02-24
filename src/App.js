import { Routes, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.scss';
// import './assets/scss/styles_ver1.scss';
import Navigation from './components/navigation/Navigation';
import About from './pages/About/About';
import Datasets from './pages/Datasets/Datasets';
import Dashboard from './pages/Dashboard/Dashboard';
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Navigation />
      <div className='App h-screen w-screen pt-12 bg-gradient-to-br from-white via-stone-50 to-stone-200'>

        <Routes>
          <Route path="/" element={<About />} />
          <Route path="about" element={<About />} />
          <Route path="datasets" element={<Datasets />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

      </div>
    </>
  );
}

export default App;
