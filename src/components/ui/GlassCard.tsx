import React, { ReactNode, HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const GlassCard = ({ children, className = '', ...props }: GlassCardProps) => {
  return (
    <div className={`glass glass-border shadow-warm ${className}`} {...props}>
      {children}
    </div>
  );
};

export default GlassCard;
