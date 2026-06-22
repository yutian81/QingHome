import { useSite } from '../context/SiteContext.jsx';
import FaIcon from './Icons.jsx';

export default function Hero() {
  const { config } = useSite();
  const p = config?.profile || {};
  const statsList = config?.stats || [];

  return (
    <section id="home" className="hero">
      <div className="hero-bg" />
      <div className="container hero-inner">
        <div className="hero-avatar">
          {p.avatar ? (
            <img src={p.avatar} alt={p.name} />
          ) : (
            <div className="hero-avatar-fallback">{p.name?.[0] || 'Q'}</div>
          )}
        </div>

        <h1 className="hero-name">{p.name || 'QingHome'}</h1>
        <p className="hero-title">{p.title || ''}</p>
        <p className="hero-tagline">{p.tagline || ''}</p>
        <p className="hero-bio">{p.bio?.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}</p>

        <div className="hero-status">
          {p.status === 'available' && <span className="status-dot available" />}
          {p.status === 'busy' && <span className="status-dot busy" />}
          {p.status === 'offline' && <span className="status-dot offline" />}
          <span>{p.status === 'available' ? '开放合作' : p.status === 'busy' ? '忙碌中' : '暂离'}</span>
        </div>

        {statsList.length > 0 && (
          <div className="hero-stats">
            {statsList.map((s, i) => (
              <div key={i} className="hero-stat-card">
                <FaIcon icon={s.icon} />
                <div className="hero-stat-info">
                  <span className="hero-stat-value">{s.value}</span>
                  <span className="hero-stat-label">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}