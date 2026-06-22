export default function Section({ id, title, icon, children }) {
  return (
    <section id={id} className="section">
      <div className="container">
        <h2 className="section-title">
          {icon && <i className={icon} />} {title}
        </h2>
        {children}
      </div>
    </section>
  );
}