import { useSite } from '../context/SiteContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { FaIcon } from './Icons.jsx';

export default function Footer() {
  const { config } = useSite();
  const { user } = useAuth();
  const brand = config?.profile?.brand || 'QingHome';
  const socialsList = config?.socials || [];
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">{brand.charAt(0)}</span>
          <span>{brand}</span>
        </div>

        <p className="footer__text">
          © {year} {brand}. Built with React + Vite, deployed on Cloudflare Workers.
          {user && <span style={{ marginLeft: 8 }}>· <Link to="/admin" style={{ color: 'var(--brand)' }}>管理</Link></span>}
        </p>

        <div className="footer__socials">
          {socialsList.map((s, i) => (
            <a
              key={i}
              href={s.url}
              target={s.url.startsWith('mailto:') ? undefined : '_blank'}
              rel="noreferrer"
              className="footer__icon"
              aria-label={s.name}
              title={s.name}
            >
              <FaIcon icon={s.icon} size={18} />
            </a>
          ))}
          {!user && (
            <Link to="/admin/login" className="footer__icon" aria-label="登录" title="登录后台">
              <FaIcon icon="fa-solid fa-lock" size={16} />
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}