import { useState, useEffect } from 'react';
import { Cloud, Search, Droplets, Wind, Thermometer } from 'lucide-react';

function WeatherView() {
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState('');
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const key = localStorage.getItem('openweather_api_key');
    if (key) {
      setSavedKey(key);
      setApiKey(key);
    }
  }, []);

  const saveKey = () => {
    localStorage.setItem('openweather_api_key', apiKey);
    setSavedKey(apiKey);
  };

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city || !savedKey) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${savedKey}&units=metric&lang=es`);
      const data = await res.json();
      
      if (res.ok) {
        setWeatherData(data);
      } else {
        setError(data.message || 'Error al buscar la ciudad');
        setWeatherData(null);
      }
    } catch (err) {
      setError('Error de red');
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="text-gradient">OpenWeather</h1>
        <p>Consulta el clima en tiempo real. Requiere tu propia API Key.</p>
      </div>

      {!savedKey ? (
        <div className="glass-card p-6" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Configura tu API Key</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Para usar esta vista, necesitas generar una clave gratuita en openweathermap.org.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              className="input-glass" 
              placeholder="Ingresa tu API Key..." 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <button className="btn-primary" onClick={saveKey}>Guardar</button>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="glass-card p-6 mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--success)' }}>✓ API Key configurada</span>
            <button 
              style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => { localStorage.removeItem('openweather_api_key'); setSavedKey(''); setWeatherData(null); }}
            >
              Cambiar clave
            </button>
          </div>

          <form onSubmit={fetchWeather} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <input 
              type="text" 
              className="input-glass" 
              placeholder="Ejemplo: Madrid, ES o Mexico City" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button type="submit" className="btn-primary">
              <Search size={20} /> Buscar
            </button>
          </form>

          {loading && <div className="spinner"></div>}
          
          {error && (
            <div className="api-key-banner">
              <strong>Error:</strong> {error}
            </div>
          )}

          {weatherData && !loading && (
            <div className="glass-card p-6" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {weatherData.name}, {weatherData.sys.country}
              </h2>
              <p style={{ color: 'var(--text-secondary)', textTransform: 'capitalize', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                {weatherData.weather[0].description}
              </p>
              
              <div style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--accent-color)', marginBottom: '2rem' }}>
                {Math.round(weatherData.main.temp)}°C
              </div>

              <div className="grid-cards" style={{ width: '100%', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                  <Thermometer size={24} style={{ color: '#ef4444', margin: '0 auto 0.5rem auto' }} />
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sensación</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{Math.round(weatherData.main.feels_like)}°C</div>
                </div>
                
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                  <Droplets size={24} style={{ color: '#3b82f6', margin: '0 auto 0.5rem auto' }} />
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Humedad</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{weatherData.main.humidity}%</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                  <Wind size={24} style={{ color: '#10b981', margin: '0 auto 0.5rem auto' }} />
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Viento</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{weatherData.wind.speed} m/s</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default WeatherView;
