import { useSite } from '../context/SiteContext.jsx';
import { FaIcon, IconArrow, IconMail } from './Icons.jsx';

export default function Hero() {
  const { config } = useSite();
  const p = config?.profile || {};
  const statsList = config?.stats || [];
  const initials = (p.name || 'Q').slice(0, 2).toUpperCase();

  return (
    <section className="hero" id="home">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__blob hero__blob--1" />
        <div className="hero__blob hero__blob--2" />
        <div className="hero__grid" />
      </div>

      <div className="hero__inner">
        <div className="hero__avatar-col">
          <div className="hero__avatar">
            {p.avatar ? (
              <img src={p.avatar} alt={p.name} fetchpriority="high" />
            ) : (
              <span>{initials}</span>
            )}
            <span className={`hero__status hero__status--${p.status || 'offline'}`} />
          </div>
        </div>

        <div className="hero__content">
          <p className="hero__hello">
            <span className="hero__wave">👋</span> Hello, I'm
          </p>
          <h1 className="hero__name">{p.name || 'QingHome'}</h1>
          <p className="hero__title">{p.title || ''}</p>
          <p className="hero__tagline">{p.tagline || ''}</p>
          <p className="hero__bio">
            {(p.bio || '').replace(/\\n|<br\s*\/?>/gi, '<br>').split('<br>').map((line, i) => (
              <span key={i}>{i > 0 && <br />}{line}</span>
            ))}
          </p>

          <div className="hero__cta">
            <button
              className="btn btn--primary"
              onClick={() => document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' })}
            >
              精选文章 <IconArrow size={16} />
            </button>
            <button
              className="btn btn--primary"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Github <IconArrow size={16} />
            </button>
            <a className="btn btn--ghost" href={`mailto:${p.email}`}>
              <IconMail size={16} /> 联系我
            </a>
          </div>

          {statsList.length > 0 && (
            <div className="hero__stats">
              {statsList.map((s, i) => (
                <div className="stat-pill" key={i}>
                  <FaIcon icon={s.icon} size={16} />
                  <span className="stat-pill__value">{s.value}</span>
                  <span className="stat-pill__label">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}