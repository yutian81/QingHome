import { useSite } from '../context/SiteContext.jsx';
import Section from './Section.jsx';
import FaIcon from './Icons.jsx';

const CATEGORY_NAMES = {
  nav: '导航', video: '视频', email: '邮箱', images: '图片',
  links: '链接', ssh: 'SSH', sub: '订阅', tools: '工具', other: '其他',
};

export default function Resources() {
  const { config } = useSite();
  const resourcesList = config?.resources || [];

  // 按分类分组
  const groups = {};
  resourcesList.forEach(r => {
    const cat = r.category || 'other';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(r);
  });

  return (
    <Section id="resources" title="站点" icon="fa-solid fa-compass">
      {Object.entries(groups).map(([cat, items]) => (
        <div key={cat} className="resource-group">
          <h3 className="resource-cat-title">
            <FaIcon icon={items[0]?.icon || 'fa-solid fa-link'} />
            {CATEGORY_NAMES[cat] || cat}
          </h3>
          <div className="card-grid">
            {items.map((r, i) => (
              <a key={i} href={r.url} className="card resource-card" target="_blank" rel="noopener noreferrer">
                <div className="card-icon"><FaIcon icon={r.icon} /></div>
                <div className="card-body">
                  <h3 className="card-title">{r.title}</h3>
                  <p className="card-desc">{r.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </Section>
  );
}