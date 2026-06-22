import { useSite } from '../context/SiteContext.jsx';
import Section from './Section.jsx';
import { FaIcon, IconArrow } from './Icons.jsx';

export default function Resources() {
  const { config } = useSite();
  const resourcesList = config?.resources || [];

  return (
    <Section
      id="resources"
      eyebrow="Resources"
      title="公益站点"
      subtitle="自建及精选公益站点，持续更新"
    >
      <div className="cards cards--resources">
        {resourcesList.map((r, i) => (
          <a className="card card--resource" href={r.url} key={i} target="_blank" rel="noreferrer">
            <div className="card__icon">
              <FaIcon icon={r.icon} size={22} />
            </div>
            <div className="card__body">
              <div className="card__row">
                <h3 className="card__title">{r.title}</h3>
                <span className="card__cat">{r.category}</span>
              </div>
              <p className="card__desc">{r.description}</p>
              <span className="card__go">
                查看 <IconArrow size={13} />
              </span>
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}