'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default';
}

export function Card({ children, className, variant = 'default' }: CardProps) {
  return (
    <div className={cn(
      'card animate-fade-in',
      className
    )}>
      {children}
    </div>
  );
}
