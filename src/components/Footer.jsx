import { useSite } from '../context/SiteContext.jsx';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import FaIcon from './Icons.jsx';

export default function Footer() {
  const { config } = useSite();
  const { user } = useAuth();
  const brand = config?.profile?.brand || 'QingHome';
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          <FaIcon icon="fa-regular fa-copyright" /> {year} {brand}
          {user && <span style={{ marginLeft: 12, color: 'var(--brand)', fontSize: 13 }}>· <Link to="/admin">管理后台</Link></span>}
        </p>
        <p className="footer-motto">
          用代码解决问题，用文字记录思考。
          <span style={{ marginLeft: 12 }}>
            <Link to={user ? '/admin' : '/admin/login'} style={{ color: 'var(--text-dim)', fontSize: 13 }}>
              {user ? '后台' : '登录'}
            </Link>
          </span>
        </p>
      </div>
    </footer>
  );
}