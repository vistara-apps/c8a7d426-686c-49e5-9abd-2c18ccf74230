'use client';

import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: 'active' | 'inactive' | 'pending';
  children: React.ReactNode;
  className?: string;
}

export function StatusIndicator({ status, children, className }: StatusIndicatorProps) {
  const variants = {
    active: 'status-active',
    inactive: 'status-inactive',
    pending: 'status-pending',
  };

  return (
    <span className={cn(variants[status], className)}>
      {children}
    </span>
  );
}
