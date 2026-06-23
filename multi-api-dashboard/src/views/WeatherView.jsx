import { useState } from 'react';
import { Search, Droplets, Wind, Thermometer, Eye, Gauge, MapPin } from 'lucide-react';

// WMO Weather Code → descripción e ícono emoji
const WMO_CODES = {
  0:  { desc: 'Cielo despejado',       icon: '☀️' },
  1:  { desc: 'Principalmente despejado', icon: '🌤️' },
  2:  { desc: 'Parcialmente nublado',   icon: '⛅' },
  3:  { desc: 'Nublado',               icon: '☁️' },
  45: { desc: 'Niebla',                icon: '🌫️' },
  48: { desc: 'Niebla con escarcha',   icon: '🌫️' },
  51: { desc: 'Llovizna ligera',       icon: '🌦️' },
  53: { desc: 'Llovizna moderada',     icon: '🌦️' },
  55: { desc: 'Llovizna intensa',      icon: '🌧️' },
  61: { desc: 'Lluvia ligera',         icon: '🌧️' },
  63: { desc: 'Lluvia moderada',       icon: '🌧️' },
  65: { desc: 'Lluvia intensa',        icon: '🌧️' },
  71: { desc: 'Nieve ligera',          icon: '🌨️' },
  73: { desc: 'Nieve moderada',        icon: '🌨️' },
  75: { desc: 'Nieve intensa',         icon: '❄️' },
  77: { desc: 'Granizo',              icon: '🌨️' },
  80: { desc: 'Chubascos ligeros',     icon: '🌦️' },
  81: { desc: 'Chubascos moderados',   icon: '🌧️' },
  82: { desc: 'Chubascos fuertes',     icon: '⛈️' },
  85: { desc: 'Chubascos de nieve',    icon: '🌨️' },
  86: { desc: 'Chubascos de nieve fuertes', icon: '❄️' },
  95: { desc: 'Tormenta eléctrica',    icon: '⛈️' },
  96: { desc: 'Tormenta con granizo',  icon: '⛈️' },
  99: { desc: 'Tormenta fuerte con granizo', icon: '⛈️' },
};

function getWeatherInfo(code) {
  return WMO_CODES[code] || { desc: 'Desconocido', icon: '🌡️' };
}

function getBgGradient(code) {
  if (code === 0 || code === 1) return 'linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)';
  if (code === 2 || code === 3) return 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)';
  if (code >= 45 && code <= 48) return 'linear-gradient(135deg, #3d4451 0%, #606876 100%)';
  if (code >= 51 && code <= 67) return 'linear-gradient(135deg, #1a2a4a 0%, #2c4a7c 100%)';
  if (code >= 71 && code <= 77) return 'linear-gradient(135deg, #2d3a4a 0%, #4a6080 100%)';
  if (code >= 80 && code <= 82) return 'linear-gradient(135deg, #1a2a4a 0%, #2c5282 100%)';
  if (code >= 95) return 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
  return 'linear-gradient(135deg, #1a2a4a 0%, #2c4a7c 100%)';
}

function WeatherView() {
  const [city, setCity]           = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    setWeatherData(null);

    try {
      // 1. Geocoding: ciudad → coordenadas
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es&format=json`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError('Ciudad no encontrada. Intenta con otro nombre.');
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country, admin1 } = geoData.results[0];

      // 2. Clima actual
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure,visibility` +
        `&wind_speed_unit=ms&timezone=auto`
      );
      const wData = await weatherRes.json();

      setWeatherData({
        name,
        country,
        region: admin1 || '',
        current: wData.current,
      });
    } catch (err) {
      setError('Error de red. Verifica tu conexión.');
    }

    setLoading(false);
  };

  const info = weatherData ? getWeatherInfo(weatherData.current.weather_code) : null;
  const bgGradient = weatherData ? getBgGradient(weatherData.current.weather_code) : null;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="text-gradient">Weather</h1>
        <p>Clima en tiempo real con <strong>Open-Meteo</strong> — sin API key requerida.</p>
      </div>

      {/* Buscador */}
      <form onSubmit={fetchWeather} style={{ display: 'flex', gap: '1rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
        <input
          type="text"
          className="input-glass"
          placeholder="Ej: Mexico City, Paris, Tokyo..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          id="weather-city-input"
        />
        <button type="submit" className="btn-primary" id="weather-search-btn" disabled={loading}>
          <Search size={20} />
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="api-key-banner" style={{ maxWidth: '600px', margin: '0 auto 1rem auto' }}>
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      {/* Spinner */}
      {loading && <div className="spinner" style={{ margin: '2rem auto' }}></div>}

      {/* Resultado */}
      {weatherData && !loading && (
        <div
          style={{
            maxWidth: '700px',
            margin: '0 auto',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          {/* Header con gradiente según clima */}
          <div
            style={{
              background: bgGradient,
              padding: '2.5rem 2rem',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <div style={{ fontSize: '5rem', marginBottom: '0.5rem', lineHeight: 1 }}>
              {info.icon}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <MapPin size={16} style={{ color: 'rgba(255,255,255,0.7)' }} />
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem' }}>
                {weatherData.name}{weatherData.region ? `, ${weatherData.region}` : ''} — {weatherData.country}
              </span>
            </div>
            <div style={{ fontSize: '5rem', fontWeight: '800', color: '#fff', lineHeight: 1.1, margin: '0.5rem 0' }}>
              {Math.round(weatherData.current.temperature_2m)}°C
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', textTransform: 'capitalize' }}>
              {info.desc}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Sensación térmica: {Math.round(weatherData.current.apparent_temperature)}°C
            </div>
          </div>

          {/* Detalles */}
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1px',
              background: '#ffffff10',
            }}
          >
            {[
              {
                icon: <Droplets size={22} style={{ color: '#60a5fa' }} />,
                label: 'Humedad',
                value: `${weatherData.current.relative_humidity_2m}%`,
              },
              {
                icon: <Wind size={22} style={{ color: '#34d399' }} />,
                label: 'Viento',
                value: `${weatherData.current.wind_speed_10m} m/s`,
              },
              {
                icon: <Gauge size={22} style={{ color: '#f59e0b' }} />,
                label: 'Presión',
                value: `${Math.round(weatherData.current.surface_pressure)} hPa`,
              },
              {
                icon: <Thermometer size={22} style={{ color: '#ef4444' }} />,
                label: 'Sensación',
                value: `${Math.round(weatherData.current.apparent_temperature)}°C`,
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  padding: '1.2rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {item.icon}
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{item.label}</div>
                  <div style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: '600' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', textAlign: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
              Datos provistos por <strong style={{ color: 'var(--accent-color)' }}>Open-Meteo</strong> · Gratis, sin API Key
            </span>
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {!weatherData && !loading && !error && (
        <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌍</div>
          <p>Busca cualquier ciudad del mundo para ver su clima actual</p>
        </div>
      )}
    </div>
  );
}

export default WeatherView;
