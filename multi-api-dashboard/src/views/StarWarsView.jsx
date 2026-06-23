import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = ['people', 'planets', 'films', 'species', 'vehicles', 'starships'];
const CAT_ICONS  = { people: '👤', planets: '🪐', films: '🎬', species: '👾', vehicles: '🚗', starships: '🚀' };
const CAT_ES     = { people: 'Personajes', planets: 'Planetas', films: 'Películas', species: 'Especies', vehicles: 'Vehículos', starships: 'Naves' };

function StarWarsView() {
  const [category, setCategory] = useState('people');
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(false);
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(0);
  const [search, setSearch]     = useState('');

  const PER_PAGE = 10;

  const fetchItems = async (cat = category, p = 1, q = '') => {
    setLoading(true);
    setItems([]);
    const url = `https://www.swapi.tech/api/${cat}/?page=${p}&limit=${PER_PAGE}${q ? `&search=${encodeURIComponent(q)}` : ''}`;
    try {
      const res  = await fetch(url);
      const data = await res.json();
      setItems(data.results || []);
      setTotal(data.total_records || data.count || 0);
      setPage(p);
    } catch {
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleCategory = (cat) => {
    setCategory(cat);
    setSearch('');
    setPage(1);
    fetchItems(cat, 1, '');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems(category, 1, search);
  };

  const getFields = (item) => {
    const p = item.properties || item;
    const fields = [];
    if (p.birth_year)   fields.push(['🎂 Nacimiento', p.birth_year]);
    if (p.gender)       fields.push(['⚧ Género', p.gender]);
    if (p.height)       fields.push(['📏 Altura', `${p.height} cm`]);
    if (p.mass)         fields.push(['⚖️ Masa', `${p.mass} kg`]);
    if (p.eye_color)    fields.push(['👁 Ojos', p.eye_color]);
    if (p.climate)      fields.push(['🌡 Clima', p.climate]);
    if (p.terrain)      fields.push(['🗺 Terreno', p.terrain]);
    if (p.population)   fields.push(['👥 Población', p.population]);
    if (p.director)     fields.push(['🎬 Director', p.director]);
    if (p.release_date) fields.push(['📅 Estreno', p.release_date]);
    if (p.episode_id)   fields.push(['📺 Episodio', p.episode_id]);
    if (p.model)        fields.push(['⚙️ Modelo', p.model]);
    if (p.manufacturer) fields.push(['🏭 Fabricante', p.manufacturer]);
    if (p.max_atmosphering_speed) fields.push(['💨 Velocidad', p.max_atmosphering_speed]);
    if (p.cost_in_credits) fields.push(['💰 Precio', `${p.cost_in_credits} créditos`]);
    return fields.slice(0, 4);
  };

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="text-gradient">Star Wars API</h1>
        <p>Universo Star Wars completo vía <strong>swapi.tech</strong></p>
      </div>

      {/* Categorías */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => handleCategory(cat)}
            style={{
              padding: '0.5rem 1.1rem', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
              background: category === cat ? 'var(--accent-color)' : 'rgba(255,255,255,0.08)',
              color: 'var(--text-primary)', transition: 'all 0.2s',
            }}
          >{CAT_ICONS[cat]} {CAT_ES[cat]}</button>
        ))}
      </div>

      {/* Búsqueda */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
        <input type="text" className="input-glass" placeholder={`Buscar ${CAT_ES[category].toLowerCase()}...`}
          value={search} onChange={e => setSearch(e.target.value)} />
        <button type="submit" className="btn-primary"><Search size={18} /></button>
      </form>

      {loading && <div className="spinner" style={{ margin: '2rem auto' }}></div>}

      <div className="grid-cards">
        {items.map((item, i) => {
          const props = item.properties || item;
          const name  = props.name || props.title || '—';
          const fields = getFields(item);
          return (
            <div key={i} className="glass-card p-6" style={{ transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{CAT_ICONS[category]}</div>
              <h3 style={{ color: 'var(--text-primary)', margin: '0 0 0.75rem', fontSize: '1rem' }}>{name}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {fields.map(([label, val], j) => (
                  <div key={j} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                    <span style={{ color: 'var(--text-primary)', textAlign: 'right', maxWidth: '55%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button className="btn-primary" onClick={() => fetchItems(category, page - 1, search)} disabled={page <= 1 || loading}>
            <ChevronLeft size={18} />
          </button>
          <span style={{ color: 'var(--text-secondary)' }}>Página {page} de {totalPages}</span>
          <button className="btn-primary" onClick={() => fetchItems(category, page + 1, search)} disabled={page >= totalPages || loading}>
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export default StarWarsView;
