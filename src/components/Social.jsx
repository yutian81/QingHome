import { useSite } from '../context/SiteContext.jsx';
import Section from './Section.jsx';
import FaIcon from './Icons.jsx';

export default function Social() {
  const { config } = useSite();
  const socialsList = config?.socials || [];
  const email = config?.profile?.email;

  return (
    <Section id="connect" title="联系" icon="fa-solid fa-envelope">
      <div className="card-grid social-grid">
        {socialsList.map((s, i) => (
          <a key={i} href={s.url} className="card social-card" target="_blank" rel="noopener noreferrer" style={s.color ? { '--social-color': s.color } : {}}>
            <div className="social-icon-wrap"><FaIcon icon={s.icon} /></div>
            <div className="card-body">
              <h3 className="card-title">{s.name}</h3>
              <p className="card-desc social-handle">{s.handle || s.url}</p>
            </div>
          </a>
        ))}
        {email && (
          <a href={`mailto:${email}`} className="card social-card cta-card" target="_blank" rel="noopener noreferrer">
            <div className="social-icon-wrap"><FaIcon icon="fa-solid fa-paper-plane" /></div>
            <div className="card-body">
              <h3 className="card-title">📬 给我发邮件</h3>
              <p className="card-desc">随时欢迎交流</p>
            </div>
          </a>
        )}
      </div>
    </Section>
  );
}