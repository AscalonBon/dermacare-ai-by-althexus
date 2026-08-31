export function FloatingCard({ 
  type = 'analysis', 
  children, 
  className = '' 
}) {
  const cardTypes = {
    analysis: 'analysis-card',
    recommendation: 'recommendation-card',
    detect: 'detect-card',
    progress: 'progress-card',
  };

  return (
    <div className={`${cardTypes[type] || cardTypes.analysis} ${className}`}>
      {children}
    </div>
  );
}