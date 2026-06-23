import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import PokeApiView from './views/PokeApiView';
import JsonPlaceholderView from './views/JsonPlaceholderView';
import CovidView from './views/CovidView';
import CryptoView from './views/CryptoView';
import WeatherView from './views/WeatherView';
import MarvelView from './views/MarvelView';
import ChuckNorrisView from './views/ChuckNorrisView';
import RickAndMortyView from './views/RickAndMortyView';
import NasaView from './views/NasaView';
import RandomUserView from './views/RandomUserView';
import CountriesView from './views/CountriesView';
import StarWarsView from './views/StarWarsView';
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
            <Route path="/chucknorris" element={<ChuckNorrisView />} />
            <Route path="/rickandmorty" element={<RickAndMortyView />} />
            <Route path="/nasa" element={<NasaView />} />
            <Route path="/randomuser" element={<RandomUserView />} />
            <Route path="/countries" element={<CountriesView />} />
            <Route path="/starwars" element={<StarWarsView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
