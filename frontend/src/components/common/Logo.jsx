export function Logo({ icon = '✚', title = 'DermaCare AI', subtitle = 'AI-Powered Skin Analysis & Care' }) {
  return (
    <div className="logo">
      <div className="logo-icon">{icon}</div>
      <div>
        <h2>{title}</h2>
        <span>{subtitle}</span>
      </div>
    </div>
  );
}