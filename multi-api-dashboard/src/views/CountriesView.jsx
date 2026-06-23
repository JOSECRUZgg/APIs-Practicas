import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const REGIONS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

function CountriesView() {
  const [search, setSearch]       = useState('');
  const [countries, setCountries] = useState([]);
  const [all, setAll]             = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [region, setRegion]       = useState('');

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,flags,capital,population,region,subregion,area')
      .then(r => {
        if (!r.ok) throw new Error(`Error ${r.status}: ${r.statusText}`);
        return r.json();
      })
      .then(data => {
        if (!Array.isArray(data)) throw new Error('Respuesta inesperada de la API');
        const sorted = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setAll(sorted);
        setCountries(sorted.slice(0, 24));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const applyFilters = (q = search, r = region, source = all) => {
    let filtered = source;
    if (r) filtered = filtered.filter(c => c.region === r);
    if (q) filtered = filtered.filter(c => c.name.common.toLowerCase().includes(q.toLowerCase()));
    setCountries(filtered.slice(0, 24));
  };

  const handleSearch = (e) => { e.preventDefault(); applyFilters(); };

  const handleRegion = (r) => {
    const next = r === region ? '' : r;
    setRegion(next);
    applyFilters(search, next);
  };

  const fmt = (n) => n?.toLocaleString('es-MX') ?? '—';

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="text-gradient">REST Countries</h1>
        <p>Información de todos los países del mundo vía <strong>restcountries.com</strong></p>
      </div>

      {/* Búsqueda */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
        <input
          type="text"
          className="input-glass"
          placeholder="Buscar país... (ej: Mexico, Japan, France)"
          value={search}
          onChange={e => { setSearch(e.target.value); if (!e.target.value) applyFilters('', region); }}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          <Search size={18} />
        </button>
      </form>

      {/* Filtros de región */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
        {REGIONS.map(r => (
          <button key={r} onClick={() => handleRegion(r)}
            style={{
              padding: '0.4rem 1rem', borderRadius: '20px', border: 'none',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
              background: region === r ? 'var(--accent-color)' : 'rgba(255,255,255,0.08)',
              color: 'var(--text-primary)', transition: 'all 0.2s',
            }}
          >{r}</button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="api-key-banner" style={{ maxWidth: '700px', margin: '0 auto 1.5rem auto' }}>
          <strong>⚠️ Error:</strong> {error}
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem' }}>
            El servidor de restcountries.com puede estar caído. Intenta recargar la página.
          </p>
        </div>
      )}

      {loading && <div className="spinner" style={{ margin: '2rem auto' }}></div>}

      {/* Contador */}
      {!loading && !error && all.length > 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Mostrando {countries.length} de {all.length} países
        </p>
      )}

      {/* Grid */}
      <div className="grid-cards">
        {countries.map((c, i) => (
          <div key={i} className="glass-card" style={{ overflow: 'hidden', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <img
              src={c.flags?.svg || c.flags?.png}
              alt={`Bandera de ${c.name.common}`}
              style={{ width: '100%', height: '130px', objectFit: 'cover', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            />
            <div style={{ padding: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-primary)', fontSize: '1rem' }}>{c.name.common}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>🏙️ {c.capital?.[0] ?? '—'}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>👥 {fmt(c.population)} hab.</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>🌍 {c.region}{c.subregion ? ` · ${c.subregion}` : ''}</span>
                {c.area ? <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>📐 {fmt(Math.round(c.area))} km²</span> : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sin resultados */}
      {!loading && !error && countries.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '3rem' }}>🌐</div>
          <p>No se encontraron países con ese nombre.</p>
        </div>
      )}
    </div>
  );
}

export default CountriesView;
