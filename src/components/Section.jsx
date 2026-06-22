export default function Section({ id, eyebrow, title, subtitle, children, action }) {
  return (
    <section className="section" id={id}>
      <div className="section__inner">
        <div className="section__head">
          <div>
            {eyebrow && <span className="section__eyebrow">{eyebrow}</span>}
            <h2 className="section__title">{title}</h2>
            {subtitle && <p className="section__subtitle">{subtitle}</p>}
          </div>
          {action && <div className="section__action">{action}</div>}
        </div>
        {children}
      </div>
    </section>
  );
}