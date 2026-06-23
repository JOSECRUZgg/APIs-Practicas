import { useState, useEffect } from 'react';

const TABS = [
  { key: 'apod', label: '🌌 Foto del Día' },
  { key: 'mars', label: '🔴 Fotos de Marte' },
  { key: 'neo',  label: '☄️ Asteroides' },
];

function NasaView() {
  const [activeTab, setActiveTab] = useState('apod');
  const [apod, setApod]     = useState(null);
  const [mars, setMars]     = useState(null);
  const [neo, setNeo]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const KEY = 'DEMO_KEY';

  const fetchApod = async () => {
    setLoading(true); setError('');
    try {
      const res  = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${KEY}`);
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error?.message || json.msg || 'Error APOD');
      setApod(json);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const fetchMars = async () => {
    setLoading(true); setError('');
    try {
      const res  = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${KEY}&page=1`);
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error?.message || 'Error Mars');
      setMars(json.photos || []);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const fetchNeo = async () => {
    setLoading(true); setError('');
    try {
      const today = new Date().toISOString().slice(0, 10);
      const res   = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&api_key=${KEY}`);
      const json  = await res.json();
      if (!res.ok || json.error) throw new Error(json.error?.message || 'Error NEO');
      const all = Object.values(json.near_earth_objects || {}).flat();
      setNeo(all);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  useEffect(() => { fetchApod(); }, []);

  const handleTab = (key) => {
    setActiveTab(key);
    setError('');
    if (key === 'apod' && !apod)  fetchApod();
    if (key === 'mars' && !mars)  fetchMars();
    if (key === 'neo'  && !neo)   fetchNeo();
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="text-gradient">NASA Open API</h1>
        <p>Datos espaciales reales de la NASA · clave pública <code>DEMO_KEY</code></p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => handleTab(t.key)}
            style={{
              padding: '0.6rem 1.2rem', borderRadius: '20px', border: 'none',
              cursor: 'pointer', fontWeight: 600,
              background: activeTab === t.key ? 'var(--accent-color)' : 'rgba(255,255,255,0.08)',
              color: 'var(--text-primary)', transition: 'all 0.2s',
            }}
          >{t.label}</button>
        ))}
      </div>

      {error && (
        <div className="api-key-banner" style={{ maxWidth: '700px', margin: '0 auto 1.5rem auto' }}>
          <strong>⚠️ Error:</strong> {error}
          {error.includes('OVER_RATE_LIMIT') || error.includes('rate') ? (
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem' }}>
              La clave DEMO_KEY tiene límite de 30 solicitudes/hora. Espera unos minutos e intenta de nuevo.
            </p>
          ) : null}
        </div>
      )}

      {loading && <div className="spinner" style={{ margin: '2rem auto' }}></div>}

      {/* APOD */}
      {activeTab === 'apod' && apod && !loading && (
        <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', overflow: 'hidden' }}>
          {apod.media_type === 'image' ? (
            <img src={apod.url} alt={apod.title}
              style={{ width: '100%', maxHeight: '450px', objectFit: 'cover' }} />
          ) : (
            <iframe src={apod.url} title={apod.title}
              style={{ width: '100%', height: '400px', border: 'none' }} allowFullScreen />
          )}
          <div style={{ padding: '1.5rem' }}>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{apod.title}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>📅 {apod.date}</p>
            <p style={{ color: 'var(--text-primary)', lineHeight: '1.8', fontSize: '0.95rem' }}>{apod.explanation}</p>
          </div>
        </div>
      )}

      {/* Mars */}
      {activeTab === 'mars' && mars && !loading && (
        <div className="grid-cards">
          {mars.slice(0, 12).map(photo => (
            <div key={photo.id} className="glass-card" style={{ overflow: 'hidden' }}>
              <img src={photo.img_src} alt={`Mars sol ${photo.sol}`}
                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
              <div style={{ padding: '0.75rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>📸 {photo.camera.full_name}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>🔴 Sol {photo.sol} · {photo.earth_date}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NEO */}
      {activeTab === 'neo' && neo && !loading && (
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {neo.slice(0, 10).map(obj => (
            <div key={obj.id} className="glass-card p-6"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, color: obj.is_potentially_hazardous_asteroid ? '#f87171' : 'var(--text-primary)' }}>
                  {obj.is_potentially_hazardous_asteroid ? '⚠️' : '☄️'} {obj.name}
                </h3>
                <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0', fontSize: '0.85rem' }}>
                  Diámetro: ~{Math.round((obj.estimated_diameter.meters.estimated_diameter_min + obj.estimated_diameter.meters.estimated_diameter_max) / 2)} m
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
