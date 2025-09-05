import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
  text?: string;
}

export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  className = '',
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'border-[#1F1F6F] border-t-transparent',
    secondary: 'border-gray-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-300 border-t-transparent',
  };

  if (text) {
    return (
      <div className={cn('flex items-center justify-center space-x-2', className)}>
        <div
          className={cn(
            'border-2 rounded-full animate-spin',
            sizeClasses[size],
            colorClasses[color]
          )}
        />
        <span className="text-gray-600">{text}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'border-2 rounded-full animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  );
}

export function LoadingPage({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" className="mx-auto mb-4" />
        <p className="text-gray-600 animate-pulse">{text}</p>
      </div>
    </div>
  );
}

export function LoadingCard({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  );
}

export function LoadingButton({ 
  children, 
  isLoading, 
  className = '',
  ...props 
}: { 
  children: React.ReactNode;
  isLoading: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button 
      {...props}
      disabled={isLoading || props.disabled}
      className={cn(
        'flex items-center justify-center space-x-2',
        className,
        isLoading && 'opacity-50 cursor-not-allowed'
      )}
    >
      {isLoading && <LoadingSpinner size="sm" color="white" />}
      <span>{children}</span>
    </button>
  );
}

