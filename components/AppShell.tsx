'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className={cn(
      'min-h-screen bg-background',
      className
    )}>
      <div className="max-w-md mx-auto">
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
