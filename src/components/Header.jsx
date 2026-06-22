import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import FaIcon from './Icons.jsx';

export default function Header() {
  const { config } = useSite();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const nav = config?.navItems || [];
  const brand = config?.profile?.brand || 'QingHome';
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('qinghome2_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('qinghome2_theme', next);
  };

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-inner">
        <a href="/" className="header-brand" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          {brand}
        </a>

        <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
          {nav.map(item => (
            <button key={item.section_id || item.id} className="header-nav-link" onClick={() => scrollTo(item.section_id)}>
              <FaIcon icon={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <Link to="/admin" className="theme-toggle" title="管理后台">
                <FaIcon icon="fa-solid fa-gear" />
              </Link>
              <button className="theme-toggle" onClick={handleLogout} title="注销">
                <FaIcon icon="fa-solid fa-right-from-bracket" />
              </button>
            </>
          ) : (
            <Link to="/admin/login" className="theme-toggle" title="登录后台">
              <FaIcon icon="fa-solid fa-lock" />
            </Link>
          )}
          <button className="theme-toggle" onClick={toggleTheme} title="切换主题">
            <FaIcon icon={theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'} />
          </button>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="菜单">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}