import { useEffect, useState } from 'react';
import { useSite } from '../context/SiteContext.jsx';
import Section from './Section.jsx';
import { FaIcon, IconStarFill, IconExternal } from './Icons.jsx';

function fmtStars(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

function parseGitHubUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname !== 'github.com') return null;
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    return [parts[0], parts[1]];
  } catch { return null; }
}

function useGitHubStars(url, fallback) {
  const [stars, setStars] = useState(fallback);
  useEffect(() => {
    const repo = parseGitHubUrl(url);
    if (!repo) { setStars(fallback); return; }
    const [owner, name] = repo;
    const cacheKey = `gh-stars-${owner}-${name}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) { setStars(Number(cached)); return; }
    } catch {}
    fetch(`https://api.github.com/repos/${owner}/${name}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && typeof data.stargazers_count === 'number') {
          setStars(data.stargazers_count);
          try { sessionStorage.setItem(cacheKey, String(data.stargazers_count)); } catch {}
        }
      })
      .catch(() => {});
  }, [url, fallback]);
  return stars;
}

function ProjectCard({ p }) {
  const stars = useGitHubStars(p.url, p.stars);

  return (
    <a className="card card--project" href={p.url} target="_blank" rel="noreferrer">
      <div className="card__top">
        <div className="card__repo-icon">
          <FaIcon icon={p.icon || 'fa-brands fa-github'} size={22} />
        </div>
        <span className="card__stars">
          <IconStarFill size={13} /> {fmtStars(stars)}
        </span>
      </div>
      <h3 className="card__name">{p.name}</h3>
      <p className="card__desc">{p.description}</p>
      <div className="card__foot">
        {p.language && (
          <span className="lang">
            {p.language_color && <span className="lang__dot" style={{ background: p.language_color }} />}
            {p.language}
          </span>
        )}
        <div className="card__tags">
          {p.tags && p.tags.split(',').slice(0, 2).map((t, j) => (
            <span className="tag" key={j}>{t.trim()}</span>
          ))}
        </div>
      </div>
    </a>
  );
}

export default function Projects() {
  const { config } = useSite();
  const projectsList = config?.projects || [];

  return (
    <Section
      id="projects"
      eyebrow="Open Source"
      title="开源项目"
      subtitle="一些被社区使用与认可的小工具"
      icon="fa-solid fa-code"
      action={
        <a className="section__link" href="https://github.com/yutian81" target="_blank" rel="noreferrer">
          访问我的 Github <IconExternal size={14} />
        </a>
      }
    >
      <div className="cards cards--projects">
        {projectsList.map((p, i) => (
          <ProjectCard key={i} p={p} />
        ))}
      </div>
    </Section>
  );
}