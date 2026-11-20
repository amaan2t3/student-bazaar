import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  leftIcon = null,
  rightIcon = null,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-[#D6B779] hover:bg-[#B8933A] text-[#101827] font-semibold focus:ring-[#D6B779] shadow-sm active:bg-[#B8933A]',
    secondary: 'bg-[#1B2940] text-white hover:bg-[#101827] focus:ring-[#1B2940] border border-[#1B2940]',
    outline: 'border border-[#E5E1D8] text-[#475569] bg-white hover:bg-[#F8F5ED] focus:ring-[#D6B779] hover:border-[#D6B779]',
    ghost: 'text-[#475569] hover:text-[#101827] hover:bg-[#F8F5ED] focus:ring-[#D6B779]',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    accent: 'bg-[#D6B779] hover:bg-[#B8933A] text-[#101827] font-semibold focus:ring-[#D6B779]'
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5'
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;
