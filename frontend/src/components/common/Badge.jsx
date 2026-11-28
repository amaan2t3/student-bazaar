import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const base = 'inline-flex items-center font-medium rounded-md tracking-tight';

  const variants = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200/80',
    primary: 'bg-slate-900 text-white',
    accent: 'bg-[#F5EFE6] text-[#8C6B23] border border-[#E8DBC5]',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    outline: 'border border-slate-200 text-slate-600 bg-white'
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-xs px-3 py-1 font-semibold'
  };

  return (
    <span className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
