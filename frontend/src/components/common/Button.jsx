export function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  href = '#',
  ...props 
}) {
  const variants = {
    primary: 'primary-btn',
    secondary: 'secondary-btn',
    login: 'login-btn',
  };

  const baseClass = variants[variant] || variants.primary;
  
  return (
    <a 
      href={href} 
      className={`${baseClass} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}