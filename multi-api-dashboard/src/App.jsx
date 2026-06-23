import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import PokeApiView from './views/PokeApiView';
import JsonPlaceholderView from './views/JsonPlaceholderView';
import CovidView from './views/CovidView';
import CryptoView from './views/CryptoView';
import WeatherView from './views/WeatherView';
import MarvelView from './views/MarvelView';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pokeapi" element={<PokeApiView />} />
            <Route path="/jsonplaceholder" element={<JsonPlaceholderView />} />
            <Route path="/covid" element={<CovidView />} />
            <Route path="/crypto" element={<CryptoView />} />
            <Route path="/weather" element={<WeatherView />} />
            <Route path="/marvel" element={<MarvelView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
