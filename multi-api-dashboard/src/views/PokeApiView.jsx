import { useState, useEffect } from 'react';

function PokeApiView() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetchPokemon();
  }, [offset]);

  const fetchPokemon = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=12&offset=${offset}`);
      const data = await res.json();
      
      const detailedPokemon = await Promise.all(
        data.results.map(async (p) => {
          const pRes = await fetch(p.url);
          return await pRes.json();
        })
      );
      
      setPokemon((prev) => [...prev, ...detailedPokemon]);
    } catch (error) {
      console.error("Error fetching Pokemon:", error);
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="text-gradient">PokéAPI</h1>
        <p>Pokedex con datos de Pokémon, sus tipos y estadísticas.</p>
      </div>
      
      <div className="grid-cards">
        {pokemon.map((p, i) => (
          <div key={`${p.id}-${i}`} className="glass-card p-6 flex flex-col items-center">
            <img 
              src={p.sprites.other['official-artwork'].front_default || p.sprites.front_default} 
              alt={p.name} 
              style={{ width: '120px', height: '120px', objectFit: 'contain' }}
            />
            <h3 style={{ textTransform: 'capitalize', marginTop: '1rem', color: 'var(--text-primary)' }}>{p.name}</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              {p.types.map(t => (
                <span 
                  key={t.type.name} 
                  style={{ 
                    background: 'rgba(99, 102, 241, 0.2)', 
                    color: '#818cf8', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '999px', 
                    fontSize: '0.8rem',
                    textTransform: 'capitalize'
                  }}
                >
                  {t.type.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {loading && <div className="spinner"></div>}
      
      {!loading && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="btn-primary" onClick={() => setOffset(offset + 12)}>
            Cargar más
          </button>
        </div>
      )}
    </div>
  );
}

export default PokeApiView;
