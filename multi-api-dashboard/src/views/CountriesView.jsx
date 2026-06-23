import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

function CountriesView() {
  const [search, setSearch]     = useState('');
  const [countries, setCountries] = useState([]);
  const [all, setAll]           = useState([]);
  const [loading, setLoading]   = useState(true);
  const [region, setRegion]     = useState('');

  const REGIONS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,flags,capital,population,region,subregion,languages,currencies,area')
      .then(r => r.json())
      .then(data => {
        const sorted = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setAll(sorted);
        setCountries(sorted.slice(0, 24));
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    let filtered = all;
    if (region) filtered = filtered.filter(c => c.region === region);
    if (search) filtered = filtered.filter(c => c.name.common.toLowerCase().includes(search.toLowerCase()));
    setCountries(filtered.slice(0, 24));
  };

  const handleRegion = (r) => {
    const newRegion = r === region ? '' : r;
    setRegion(newRegion);
    let filtered = all;
    if (newRegion) filtered = filtered.filter(c => c.region === newRegion);
    if (search) filtered = filtered.filter(c => c.name.common.toLowerCase().includes(search.toLowerCase()));
    setCountries(filtered.slice(0, 24));
  };

  const fmt = (n) => n?.toLocaleString('es-MX') ?? '—';

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="text-gradient">REST Countries</h1>
        <p>Información de todos los países del mundo vía <strong>restcountries.com</strong></p>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
        <input
          type="text"
          className="input-glass"
          placeholder="Buscar país... (ej: Mexico, Japan)"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-primary"><Search size={18} /></button>
      </form>

      {/* Filtros de región */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
        {REGIONS.map(r => (
          <button key={r} onClick={() => handleRegion(r)}
            style={{
              padding: '0.4rem 1rem', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
              background: region === r ? 'var(--accent-color)' : 'rgba(255,255,255,0.08)',
              color: 'var(--text-primary)', transition: 'all 0.2s',
            }}
          >{r}</button>
        ))}
      </div>

      {loading && <div className="spinner" style={{ margin: '2rem auto' }}></div>}

      <div className="grid-cards">
        {countries.map((c, i) => (
          <div key={i} className="glass-card" style={{ overflow: 'hidden', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <img src={c.flags?.svg || c.flags?.png} alt={c.name.common}
              style={{ width: '100%', height: '140px', objectFit: 'cover', borderBottom: '1px solid rgba(255,255,255,0.08)' }} />
            <div style={{ padding: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-primary)', fontSize: '1rem' }}>{c.name.common}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>🏙️ {c.capital?.[0] ?? '—'}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>👥 {fmt(c.population)} hab.</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>🌍 {c.region} · {c.subregion}</span>
                {c.area && <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>📐 {fmt(c.area)} km²</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CountriesView;
