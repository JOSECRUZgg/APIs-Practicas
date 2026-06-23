import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Gamepad2, FileJson, Activity, Coins,
  Cloud, Shield, Laugh, Tv, Rocket, Users, Globe, Swords
} from 'lucide-react';
import './Sidebar.css';

function Sidebar() {
  const links = [
    { to: '/',              icon: <LayoutDashboard size={20} />, text: 'Dashboard' },
    { to: '/pokeapi',       icon: <Gamepad2 size={20} />,        text: 'PokéAPI' },
    { to: '/jsonplaceholder',icon: <FileJson size={20} />,       text: 'JSONPlaceholder' },
    { to: '/covid',         icon: <Activity size={20} />,        text: 'COVID Tracking' },
    { to: '/crypto',        icon: <Coins size={20} />,           text: 'Criptomonedas' },
    { to: '/weather',       icon: <Cloud size={20} />,           text: 'Weather' },
    { to: '/marvel',        icon: <Shield size={20} />,          text: 'Marvel API' },
    { to: '/chucknorris',   icon: <Laugh size={20} />,           text: 'Chuck Norris' },
    { to: '/rickandmorty',  icon: <Tv size={20} />,              text: 'Rick & Morty' },
    { to: '/nasa',          icon: <Rocket size={20} />,          text: 'NASA' },
    { to: '/randomuser',    icon: <Users size={20} />,           text: 'Random Users' },
    { to: '/countries',     icon: <Globe size={20} />,           text: 'REST Countries' },
    { to: '/starwars',      icon: <Swords size={20} />,          text: 'Star Wars' },
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
            end={link.to === '/'}
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
