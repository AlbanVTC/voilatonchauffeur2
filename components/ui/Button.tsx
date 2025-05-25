'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary';
}

export default function Button({ children, fullWidth = false, variant = 'primary', ...props }: ButtonProps) {
  const base = 'px-4 py-2 rounded-lg font-medium focus:outline-none';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
  };
  const width = fullWidth ? 'w-full' : '';
  return (
    <button className={`${base} ${variants[variant]} ${width}`} {...props}>
      {children}
    </button>
  );
}
