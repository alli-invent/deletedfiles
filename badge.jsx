import React from 'react';
import { clsx } from 'clsx';

const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const baseStyles = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

  const variants = {
    default: 'border-transparent bg-primary-100 text-primary-800 hover:bg-primary-200',
    secondary: 'border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200',
    destructive: 'border-transparent bg-red-100 text-red-800 hover:bg-red-200',
    outline: 'text-gray-950',
    success: 'border-transparent bg-green-100 text-green-800 hover:bg-green-200',
    warning: 'border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  };

  return (
    <div
      ref={ref}
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    />
  );
});
Badge.displayName = 'Badge';

export { Badge };
