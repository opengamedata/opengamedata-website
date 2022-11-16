import { Routes, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.scss';
// import './assets/scss/styles_ver1.scss';
import Navigation from './components/navigation/Navigation';
import About from './pages/About/About';
import Datasets from './pages/Datasets/Datasets';
import Dashboard from './pages/Dashboard/Dashboard';
import NotFound from "./pages/NotFound/NotFound";

function App() {
  let base_path = "/opengamedata-testing/";
  return (
    <>
      <Navigation />
      <div className='App h-screen w-screen pt-12 bg-gradient-to-br from-white via-stone-50 to-stone-200'>

        <Routes>
          <Route path={base_path+"/"} element={<Dashboard />} />
          <Route path={base_path+"about"} element={<About />} />
          <Route path={base_path+"datasets"} element={<Datasets />} />
          {/* <Route path={base_path+"dashboard"} element={<Dashboard />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>

      </div>
    </>
  );
}

export default App;
