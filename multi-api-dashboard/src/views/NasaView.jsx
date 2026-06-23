import { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';

const ENDPOINTS = [
  { key: 'apod',      label: '🌌 Foto del Día (APOD)',     url: 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY' },
  { key: 'mars',      label: '🔴 Fotos de Marte (Rover)',  url: 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=DEMO_KEY&page=1' },
  { key: 'neo',       label: '☄️ Asteroides Cercanos',    url: `https://api.nasa.gov/neo/rest/v1/feed?start_date=${new Date().toISOString().slice(0,10)}&api_key=DEMO_KEY` },
];

function NasaView() {
  const [activeTab, setActiveTab] = useState('apod');
  const [data, setData]           = useState({});
  const [loading, setLoading]     = useState(false);

  const fetchData = async (key) => {
    if (data[key]) return;
    setLoading(true);
    const endpoint = ENDPOINTS.find(e => e.key === key);
    const res  = await fetch(endpoint.url);
    const json = await res.json();
    setData(prev => ({ ...prev, [key]: json }));
    setLoading(false);
  };

  useEffect(() => { fetchData('apod'); }, []);

  const handleTab = (key) => { setActiveTab(key); fetchData(key); };

  const apod  = data['apod'];
  const mars  = data['mars'];
  const neo   = data['neo'];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="text-gradient">NASA Open API</h1>
        <p>Datos espaciales reales de la NASA — sin API Key personalizada</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {ENDPOINTS.map(e => (
          <button key={e.key} onClick={() => handleTab(e.key)}
            style={{
              padding: '0.6rem 1.2rem', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 600,
              background: activeTab === e.key ? 'var(--accent-color)' : 'rgba(255,255,255,0.08)',
              color: 'var(--text-primary)', transition: 'all 0.2s',
            }}
          >{e.label}</button>
        ))}
      </div>

      {loading && <div className="spinner" style={{ margin: '2rem auto' }}></div>}

      {/* APOD */}
      {activeTab === 'apod' && apod && !loading && (
        <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', overflow: 'hidden' }}>
          {apod.media_type === 'image' ? (
            <img src={apod.url} alt={apod.title} style={{ width: '100%', maxHeight: '450px', objectFit: 'cover' }} />
          ) : (
            <iframe src={apod.url} title={apod.title} style={{ width: '100%', height: '400px', border: 'none' }} />
          )}
          <div style={{ padding: '1.5rem' }}>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{apod.title}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>📅 {apod.date}</p>
            <p style={{ color: 'var(--text-primary)', lineHeight: '1.7', fontSize: '0.95rem' }}>{apod.explanation}</p>
          </div>
        </div>
      )}

      {/* Mars Rover */}
      {activeTab === 'mars' && mars && !loading && (
        <div className="grid-cards">
          {mars.photos?.slice(0, 12).map(photo => (
            <div key={photo.id} className="glass-card" style={{ overflow: 'hidden' }}>
              <img src={photo.img_src} alt={`Mars sol ${photo.sol}`} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
              <div style={{ padding: '0.75rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>
                  📸 {photo.camera.full_name}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                  🔴 Sol {photo.sol} · {photo.earth_date}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NEO Asteroides */}
      {activeTab === 'neo' && neo && !loading && (
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Object.values(neo.near_earth_objects || {}).flat().slice(0, 10).map(obj => (
            <div key={obj.id} className="glass-card p-6"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, color: obj.is_potentially_hazardous_asteroid ? '#f87171' : 'var(--text-primary)' }}>
                  {obj.is_potentially_hazardous_asteroid ? '⚠️' : '☄️'} {obj.name}
                </h3>
                <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0', fontSize: '0.85rem' }}>
                  Diámetro: {Math.round(obj.estimated_diameter.meters.estimated_diameter_min)}–{Math.round(obj.estimated_diameter.meters.estimated_diameter_max)} m
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--accent-color)', fontWeight: 700 }}>
                  {Number(obj.close_approach_data[0]?.miss_distance.kilometers).toLocaleString('es-MX', { maximumFractionDigits: 0 })} km
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>distancia mínima</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NasaView;
