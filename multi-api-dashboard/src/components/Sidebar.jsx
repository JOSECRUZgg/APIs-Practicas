import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Gamepad2, FileJson, Activity, Coins, Cloud, Shield } from 'lucide-react';
import './Sidebar.css';

function Sidebar() {
  const links = [
    { to: '/', icon: <LayoutDashboard size={20} />, text: 'Dashboard' },
    { to: '/pokeapi', icon: <Gamepad2 size={20} />, text: 'PokéAPI' },
    { to: '/jsonplaceholder', icon: <FileJson size={20} />, text: 'JSON Placeholder' },
    { to: '/covid', icon: <Activity size={20} />, text: 'COVID Tracking' },
    { to: '/crypto', icon: <Coins size={20} />, text: 'Criptomonedas' },
    { to: '/weather', icon: <Cloud size={20} />, text: 'OpenWeather' },
    { to: '/marvel', icon: <Shield size={20} />, text: 'Marvel API' },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <h2 className="text-gradient">API Hub</h2>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.text}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
