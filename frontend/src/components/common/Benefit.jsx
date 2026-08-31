export function Benefit({ icon, title, description }) {
  return (
    <div className="benefit">
      <div className="benefit-icon">{icon}</div>
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
}