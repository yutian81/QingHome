import { useSite } from '../context/SiteContext.jsx';
import Section from './Section.jsx';
import FaIcon from './Icons.jsx';

export default function Projects() {
  const { config } = useSite();
  const projectsList = config?.projects || [];

  const fmtStars = (n) => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n;

  return (
    <Section id="projects" title="项目" icon="fa-solid fa-code">
      <div className="card-grid">
        {projectsList.map((proj, i) => (
          <a key={i} href={proj.url} className="card project-card" target="_blank" rel="noopener noreferrer">
            <div className="card-body">
              <div className="project-header">
                <FaIcon icon={proj.icon || 'fa-brands fa-github'} />
                <h3 className="card-title">{proj.name}</h3>
              </div>
              <p className="card-desc">{proj.description}</p>
              <div className="project-footer">
                {proj.language && (
                  <span className="project-lang">
                    {proj.language_color && <span className="lang-dot" style={{ background: proj.language_color }} />}
                    {proj.language}
                  </span>
                )}
                {proj.stars > 0 && (
                  <span className="project-stars">
                    <FaIcon icon="fa-regular fa-star" /> {fmtStars(proj.stars)}
                  </span>
                )}
              </div>
            </div>
            <div className="card-tags">
              {proj.tags && proj.tags.split(',').map((tag, j) => (
                <span key={j} className="card-tag">{tag.trim()}</span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}