export default function Section({
  id,
  index,
  title,
  children,
  className = "",
}) {
  return (
    <section id={id} className={`section ${className}`}>
      <div className="container">
        <h2 className="section__title">
          <span className="mono accent">0{index}.</span> {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
