export function Badge({ children, className = '' }) {
  return (
    <div className={`badge ${className}`}>
      {children}
    </div>
  );
}