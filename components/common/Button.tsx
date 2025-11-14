import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // FIX: Made children prop optional to allow for icon-only buttons.
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'contact';
  className?: string;
  Icon?: React.FC<{className?: string}>;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', Icon, ...props }) => {
  const baseClasses = "flex items-center justify-center space-x-2 font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 w-full text-lg";
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-blue-900',
    secondary: 'bg-secondary text-primary border border-primary hover:bg-yellow-50',
    accent: 'bg-accent text-white hover:bg-green-700',
    contact: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {Icon && <Icon className="h-6 w-6" />}
      <span>{children}</span>
    </button>
  );
};

export default Button;
