import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

function RickAndMortyView() {
  const [search, setSearch]     = useState('');
  const [characters, setCharacters] = useState([]);
  const [info, setInfo]         = useState(null);
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const STATUS_COLOR = { Alive: '#4ade80', Dead: '#f87171', unknown: '#94a3b8' };

  const fetchCharacters = async (p = 1, q = search) => {
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`https://rickandmortyapi.com/api/character?page=${p}&name=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (res.ok) {
        setCharacters(data.results);
        setInfo(data.info);
        setPage(p);
      } else {
        setCharacters([]);
        setInfo(null);
        setError('No se encontraron personajes.');
      }
    } catch {
      setError('Error de red.');
    }
    setLoading(false);
  };

  const handleSubmit = (e) => { e.preventDefault(); fetchCharacters(1); };

  // Carga inicial
  useState(() => { fetchCharacters(1, ''); }, []);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="text-gradient">Rick & Morty</h1>
        <p>Explora personajes de Rick and Morty vía <strong>rickandmortyapi.com</strong></p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
        <input
          type="text"
          className="input-glass"
          placeholder="Buscar personaje... (ej: Rick, Morty)"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-primary"><Search size={18} /> Buscar</button>
      </form>

      {error && <p style={{ textAlign: 'center', color: '#f87171' }}>{error}</p>}
      {loading && <div className="spinner" style={{ margin: '2rem auto' }}></div>}

      <div className="grid-cards">
        {characters.map(char => (
          <div key={char.id} className="glass-card" style={{ overflow: 'hidden', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <img src={char.image} alt={char.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
            <div style={{ padding: '1rem' }}>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>{char.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[char.status] || '#94a3b8', display: 'inline-block' }}></span>
                {char.status} — {char.species}
              </div>
              <div style={{ marginTop: '0.3rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>📍 {char.location.name}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {info && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button className="btn-primary" onClick={() => fetchCharacters(page - 1)} disabled={!info.prev || loading}>
            <ChevronLeft size={18} />
          </button>
          <span style={{ color: 'var(--text-secondary)' }}>Página {page} de {info.pages}</span>
          <button className="btn-primary" onClick={() => fetchCharacters(page + 1)} disabled={!info.next || loading}>
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export default RickAndMortyView;
