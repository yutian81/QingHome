import { useSite } from '../context/SiteContext.jsx';
import Section from './Section.jsx';
import { FaIcon } from './Icons.jsx';

export default function Social() {
  const { config } = useSite();
  const email = config?.profile?.email;

  return (
    <Section
      id="connect"
      eyebrow="Connect"
      title="保持联系"
      subtitle="可以通过邮箱或者社交媒体找到我"
    >
      <div className="cta-box">
        <div>
          <h3 className="cta-box__title">
            <FaIcon icon="fa-solid fa-comments" size="1em" /> 想合作或交流？
          </h3>
          <p className="cta-box__text">
            邮件是最稳妥的方式，我通常会在 48 小时内回复。
          </p>
        </div>
        <a className="btn btn--primary" href={`mailto:${email}`}>
          <FaIcon icon="fa-solid fa-envelope" size="1em" /> 发邮件给我
        </a>
      </div>
    </Section>
  );
}