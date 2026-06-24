import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { FaIcon, IconSun, IconMoon, IconMenu, IconClose } from './Icons.jsx';

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
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner">
        <a href="/" className="header__brand" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          {config?.profile?.site_icon ? <img className="header__logo-img" src={config.profile.site_icon} alt={brand} /> : <span className="header__logo">{brand.charAt(0)}</span>}
          <span className="header__name">{brand}</span>
        </a>

        <nav className={`header__nav ${menuOpen ? 'is-open' : ''}`}>
          {nav.map(item => (
            <button key={item.section_id || item.id} className="header__link" onClick={() => scrollTo(item.section_id)}>
              <FaIcon icon={item.icon} size={14} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="header__actions">
          {user ? (
            <>
              <Link to="/admin" className="icon-btn" title="管理后台">
                <FaIcon icon="fa-solid fa-gear" size={16} />
              </Link>
              <button className="icon-btn" onClick={handleLogout} title="注销">
                <FaIcon icon="fa-solid fa-right-from-bracket" size={16} />
              </button>
            </>
          ) : (
            <Link to="/admin/login" className="icon-btn" title="登录后台">
              <FaIcon icon="fa-solid fa-lock" size={16} />
            </Link>
          )}
          <button className="icon-btn" onClick={toggleTheme} title="切换主题">
            {theme === 'light' ? <IconMoon size={16} /> : <IconSun size={16} />}
          </button>
          <button className="header__menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="菜单">
            {menuOpen ? <IconClose size={20} /> : <IconMenu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}