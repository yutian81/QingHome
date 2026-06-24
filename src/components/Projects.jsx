import { useEffect, useState } from 'react';
import { useSite } from '../context/SiteContext.jsx';
import Section from './Section.jsx';
import { FaIcon, IconStarFill, IconExternal } from './Icons.jsx';
import { fetchGitHubStars } from '../api.js';

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
    return `${parts[0]}/${parts[1]}`;
  } catch { return null; }
}

export default function Projects() {
  const { config } = useSite();
  const projectsList = config?.projects || [];
  const [starsMap, setStarsMap] = useState({});

  useEffect(() => {
    const repos = projectsList.map(p => parseGitHubUrl(p.url)).filter(Boolean);
    if (repos.length === 0) return;
    const cacheKey = 'qinghome2_gh_stars';
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        // 忽略空缓存（之前无 UA 时的 {} 残留）
        if (Object.keys(parsed).length > 0) { setStarsMap(parsed); return; }
      }
    } catch {}

    fetchGitHubStars(repos).then(data => {
      if (data) {
        setStarsMap(data);
        try { sessionStorage.setItem(cacheKey, JSON.stringify(data)); } catch {}
      }
    }).catch(() => {});
  }, [projectsList]);

  const getStars = (url, fallback) => {
    const repo = parseGitHubUrl(url);
    return repo && starsMap[repo] !== undefined ? starsMap[repo] : fallback;
  };

  return (
    <Section id="projects" eyebrow="Open Source" title="开源项目" subtitle="一些被社区使用与认可的小工具" icon="fa-solid fa-code"
      action={
        <a className="section__link" href={config?.profile?.github_url || 'https://github.com/yutian81'} target="_blank" rel="noreferrer">
          {config?.profile?.github_label || '访问我的 Github'} <IconExternal size={14} />
        </a>
      }
    >
      <div className="cards cards--projects">
        {projectsList.map(p => (
          <a key={p.url || p.name} className="card card--project" href={p.url} target="_blank" rel="noreferrer">
            <div className="card__top">
              <div className="card__repo-icon"><FaIcon icon={p.icon || 'fa-brands fa-github'} size={22} /></div>
              <span className="card__stars"><IconStarFill size={13} /> {fmtStars(getStars(p.url, p.stars))}</span>
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
        ))}
      </div>
    </Section>
  );
}