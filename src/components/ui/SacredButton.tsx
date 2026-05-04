import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface SacredButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}

export const SacredButton = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}: SacredButtonProps) => {
  const base =
    'inline-flex items-center justify-center gap-1.5 rounded-xl px-5 h-10 text-sm font-ui font-semibold tracking-wide transition-all duration-200 hover:-translate-y-px active:translate-y-0 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none';

  if (variant === 'primary') {
    return (
      <button
        className={`${base} ${className}`}
        style={{
          background: 'linear-gradient(135deg, #2C1A0E 0%, #6B4226 45%, #B8963E 100%)',
          color: '#FAF7F2',
          boxShadow: '0 2px 8px rgba(44,26,14,0.25), 0 6px 20px rgba(184,150,62,0.20), inset 0 1px 0 rgba(255,255,255,0.12)',
        }}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={`${base} glass glass-border shadow-warm hover:shadow-warm-lg ${className}`}
      style={{ color: 'var(--text-espresso)' }}
      {...props}
    >
      {children}
    </button>
  );
};

export default SacredButton;
