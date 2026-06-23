import { useState, useEffect } from 'react';
import { RefreshCw, Tag } from 'lucide-react';

function ChuckNorrisView() {
  const [joke, setJoke]       = useState(null);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('https://api.chucknorris.io/jokes/categories')
      .then(r => r.json())
      .then(data => setCategories(data));
    fetchJoke();
  }, []);

  const fetchJoke = async (cat = '') => {
    setLoading(true);
    const url = cat
      ? `https://api.chucknorris.io/jokes/random?category=${cat}`
      : 'https://api.chucknorris.io/jokes/random';
    const res  = await fetch(url);
    const data = await res.json();
    setJoke(data);
    setLoading(false);
  };

  const handleCategory = (cat) => {
    setSelected(cat);
    fetchJoke(cat);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="text-gradient">Chuck Norris Jokes</h1>
        <p>Chistes aleatorios sobre Chuck Norris vía <strong>chucknorris.io</strong></p>
      </div>

      {/* Categorías */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem', justifyContent: 'center' }}>
        <button
          className={`btn-primary${selected === '' ? '' : ''}`}
          onClick={() => handleCategory('')}
          style={{ background: selected === '' ? 'var(--accent-color)' : 'rgba(255,255,255,0.08)', fontSize: '0.8rem', padding: '0.4rem 1rem' }}
        >
          🎲 Random
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            style={{
              background: selected === cat ? 'var(--accent-color)' : 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'var(--text-primary)',
              borderRadius: '20px',
              padding: '0.4rem 1rem',
              cursor: 'pointer',
              fontSize: '0.8rem',
              textTransform: 'capitalize',
              transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Joke Card */}
      <div className="glass-card p-6" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
        {loading ? (
          <div className="spinner"></div>
        ) : joke ? (
          <>
            <div style={{ fontSize: '3rem' }}>🥋</div>
            <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--text-primary)', fontStyle: 'italic' }}>
              "{joke.value}"
            </p>
            {joke.categories?.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <Tag size={14} />
                {joke.categories.join(', ')}
              </div>
            )}
          </>
        ) : null}
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <button className="btn-primary" onClick={() => fetchJoke(selected)} disabled={loading}>
          <RefreshCw size={18} />
          Otro chiste
        </button>
      </div>
    </div>
  );
}

export default ChuckNorrisView;
