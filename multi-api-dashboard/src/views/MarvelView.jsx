import { useState, useEffect } from 'react';
import { Search, Key } from 'lucide-react';
import CryptoJS from 'crypto-js';

function MarvelView() {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [savedKeys, setSavedKeys] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const LIMIT = 12;

  useEffect(() => {
    const pub = localStorage.getItem('marvel_public_key');
    const priv = localStorage.getItem('marvel_private_key');
    if (pub && priv) {
      setPublicKey(pub);
      setPrivateKey(priv);
      setSavedKeys(true);
    }
  }, []);

  useEffect(() => {
    if (savedKeys) {
      fetchCharacters(0, '');
    }
  }, [savedKeys]);

  const saveKeys = () => {
    if (!publicKey || !privateKey) return;
    localStorage.setItem('marvel_public_key', publicKey);
    localStorage.setItem('marvel_private_key', privateKey);
    setSavedKeys(true);
  };

  const clearKeys = () => {
    localStorage.removeItem('marvel_public_key');
    localStorage.removeItem('marvel_private_key');
    setSavedKeys(false);
    setCharacters([]);
    setPublicKey('');
    setPrivateKey('');
  };

  const buildUrl = (nameStartsWith, offset) => {
    const ts = Date.now().toString();
    const pub = localStorage.getItem('marvel_public_key');
    const priv = localStorage.getItem('marvel_private_key');
    const hash = CryptoJS.MD5(ts + priv + pub).toString();

    let url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${pub}&hash=${hash}&limit=${LIMIT}&offset=${offset}`;
    if (nameStartsWith) {
      url += `&nameStartsWith=${encodeURIComponent(nameStartsWith)}`;
    }
    return url;
  };

  const fetchCharacters = async (offset, nameQuery) => {
    setLoading(true);
    setError('');
    try {
      const url = buildUrl(nameQuery, offset);
      const res = await fetch(url);
      const data = await res.json();

      if (data.code === 200) {
        setCharacters(data.data.results);
        setTotal(data.data.total);
        setPage(offset);
      } else {
        setError(data.message || 'Error con la API de Marvel. Verifica tus claves.');
      }
    } catch (err) {
      setError('Error de red al conectar con Marvel API.');
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCharacters(0, search);
  };

  const handlePrev = () => {
    const newOffset = Math.max(0, page - LIMIT);
    fetchCharacters(newOffset, search);
  };

  const handleNext = () => {
    if (page + LIMIT < total) {
      fetchCharacters(page + LIMIT, search);
    }
  };

  if (!savedKeys) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1 className="text-gradient">Marvel API</h1>
          <p>Explora el Universo Marvel: personajes, cómics y más.</p>
        </div>

        <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(220, 38, 38, 0.2)', padding: '0.75rem', borderRadius: '50%' }}>
              <Key size={28} style={{ color: '#dc2626' }} />
            </div>
            <div>
              <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Configura tus API Keys</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                Regístrate en <a href="https://developer.marvel.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#818cf8' }}>developer.marvel.com</a> para obtener tus claves gratuitas.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
                Clave Pública (Public Key)
              </label>
              <input
                type="text"
                className="input-glass"
                placeholder="Tu Public Key de Marvel..."
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
              />
            </div>
            <div>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
                Clave Privada (Private Key)
              </label>
              <input
                type="password"
                className="input-glass"
                placeholder="Tu Private Key de Marvel..."
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
              />
            </div>
            <button className="btn-primary" onClick={saveKeys} style={{ marginTop: '0.5rem' }}>
              Guardar y Conectar
            </button>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>¿Cómo obtener las claves?</strong><br />
            1. Ve a developer.marvel.com<br />
            2. Crea una cuenta gratuita<br />
            3. En tu perfil verás tu <em>Public Key</em> y <em>Private Key</em><br />
            4. Agrega <code style={{ color: '#818cf8' }}>localhost</code> a tus dominios autorizados
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="text-gradient">Marvel API</h1>
        <p>Personajes del Universo Marvel. ({total} personajes disponibles)</p>
      </div>

      {/* Controls bar */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flex: 1 }}>
          <input
            type="text"
            className="input-glass"
            placeholder="Buscar personaje (ej: Spider-Man)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            <Search size={18} /> Buscar
          </button>
        </form>
        <button
          onClick={clearKeys}
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', color: '#fca5a5', padding: '0.75rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}
        >
          Cambiar claves
        </button>
      </div>

      {error && <div className="api-key-banner"><strong>Error:</strong> {error}</div>}

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          <div className="grid-cards">
            {characters.map((char, i) => {
              const imgUrl = `${char.thumbnail.path}.${char.thumbnail.extension}`;
              const isPlaceholder = char.thumbnail.path.includes('image_not_available');
              return (
                <div
                  key={char.id}
                  className="glass-card"
                  style={{ overflow: 'hidden', animationDelay: `${i * 50}ms` }}
                >
                  <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                    {!isPlaceholder ? (
                      <img
                        src={imgUrl}
                        alt={char.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a2e, #dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                        🦸
                      </div>
                    )}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '1rem' }}>
                      <h3 style={{ color: 'white', margin: 0, fontSize: '1.1rem' }}>{char.name}</h3>
                    </div>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', minHeight: '3em' }}>
                      {char.description
                        ? (char.description.length > 100 ? char.description.substring(0, 100) + '...' : char.description)
                        : 'Sin descripción disponible.'}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span>📚 {char.comics.available} cómics</span>
                      <span>📖 {char.series.available} series</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {total > LIMIT && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
              <button
                className="btn-primary"
                onClick={handlePrev}
                disabled={page === 0}
                style={{ opacity: page === 0 ? 0.5 : 1 }}
              >
                ← Anterior
              </button>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {page + 1}–{Math.min(page + LIMIT, total)} de {total}
              </span>
              <button
                className="btn-primary"
                onClick={handleNext}
                disabled={page + LIMIT >= total}
                style={{ opacity: page + LIMIT >= total ? 0.5 : 1 }}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MarvelView;
