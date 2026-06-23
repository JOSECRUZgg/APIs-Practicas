import { useState, useEffect } from 'react';
import { RefreshCw, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

function RandomUserView() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount]     = useState(9);

  const fetchUsers = async (n = count) => {
    setLoading(true);
    const res  = await fetch(`https://randomuser.me/api/?results=${n}&nat=mx,us,es`);
    const data = await res.json();
    setUsers(data.results);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="text-gradient">Random Users</h1>
        <p>Usuarios aleatorios generados por <strong>randomuser.me</strong></p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', alignItems: 'center' }}>
        <select
          value={count}
          onChange={e => setCount(Number(e.target.value))}
          className="input-glass"
          style={{ maxWidth: '180px' }}
        >
          {[3, 6, 9, 12].map(n => <option key={n} value={n}>{n} usuarios</option>)}
        </select>
        <button className="btn-primary" onClick={() => fetchUsers(count)} disabled={loading}>
          <RefreshCw size={18} /> Generar
        </button>
      </div>

      {loading && <div className="spinner" style={{ margin: '2rem auto' }}></div>}

      <div className="grid-cards">
        {users.map((user, i) => (
          <div key={i} className="glass-card p-6" style={{ textAlign: 'center', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <img
              src={user.picture.large}
              alt={user.name.first}
              style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--accent-color)', marginBottom: '1rem' }}
            />
            <h3 style={{ margin: '0 0 0.25rem', color: 'var(--text-primary)' }}>
              {user.name.title} {user.name.first} {user.name.last}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0 0 1rem' }}>
              {user.location.country}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
              {[
                { icon: <Mail size={13} />, val: user.email },
                { icon: <Phone size={13} />, val: user.phone },
                { icon: <MapPin size={13} />, val: `${user.location.city}, ${user.location.state}` },
                { icon: <Calendar size={13} />, val: `${user.dob.age} años` },
              ].map((item, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--accent-color)', flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RandomUserView;
