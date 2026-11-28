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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]';

  const variants = {
    primary: 'bg-slate-900 hover:bg-slate-800 text-white font-medium border border-slate-900 shadow-sm focus:ring-slate-900 active:bg-slate-950',
    accent: 'bg-[#C89D42] hover:bg-[#B58B35] text-slate-950 font-semibold border border-[#B58B35]/40 shadow-sm focus:ring-[#C89D42]',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium border border-slate-200 focus:ring-slate-400',
    outline: 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 font-medium shadow-xs focus:ring-slate-400',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium focus:ring-slate-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white font-medium shadow-xs focus:ring-red-500'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 leading-normal',
    md: 'text-sm px-4 py-2 gap-2 leading-normal',
    lg: 'text-sm font-semibold px-5 py-2.5 gap-2.5 leading-normal'
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
