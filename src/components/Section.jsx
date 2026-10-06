export default function Section({ id, index, label, title, children }) {
  return (
    <section id={id} className="section">
      <div className="container">
        <header className="section__head" data-reveal>
          <p className="label">
            <span className="section__index">{index}</span> {label}
          </p>
          <h2 className="section__title">{title}</h2>
        </header>
        {children}
      </div>
    </section>
  );
}
