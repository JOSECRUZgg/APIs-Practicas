import { Link } from 'react-router-dom';
import { Gamepad2, FileJson, Activity, Coins, Cloud, Shield } from 'lucide-react';

function Dashboard() {
  const apis = [
    { title: 'PokéAPI', icon: <Gamepad2 size={32} />, path: '/pokeapi', color: '#ef4444', desc: 'Base de datos de Pokémon' },
    { title: 'JSON Placeholder', icon: <FileJson size={32} />, path: '/jsonplaceholder', color: '#10b981', desc: 'Datos falsos para pruebas' },
    { title: 'COVID Tracking', icon: <Activity size={32} />, path: '/covid', color: '#3b82f6', desc: 'Estadísticas históricas' },
    { title: 'Criptomonedas', icon: <Coins size={32} />, path: '/crypto', color: '#f59e0b', desc: 'Mercado en tiempo real' },
    { title: 'OpenWeather', icon: <Cloud size={32} />, path: '/weather', color: '#0ea5e9', desc: 'Clima global' },
    { title: 'Marvel API', icon: <Shield size={32} />, path: '/marvel', color: '#dc2626', desc: 'Universo Marvel' }
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="text-gradient">Sitio de APIs Gratuitas</h1>
        <p>Explora y consume datos de 6 de las mejores APIs públicas en un solo lugar.</p>
      </div>

      <div className="grid-cards mt-8">
        {apis.map((api, index) => (
          <Link 
            key={api.path} 
            to={api.path} 
            className="glass-card p-6 flex flex-col items-center justify-center text-center gap-4 hover:scale-105 transition-transform"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div 
              style={{ color: api.color, background: `${api.color}20`, padding: '1rem', borderRadius: '50%' }}
            >
              {api.icon}
            </div>
            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.25rem' }}>{api.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{api.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
