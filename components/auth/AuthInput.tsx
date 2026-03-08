// components/auth/AuthInput.tsx
import { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  rightElement?: React.ReactNode;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, icon: Icon, error, rightElement, className, ...props }, ref) => {
    return (
      <div>
        <label className="block text-sm font-medium text-navy-800 mb-1.5 font-sans">{label}</label>
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          )}
          <input
            ref={ref}
            className={cn(
              'input-field',
              Icon && 'pl-10',
              rightElement && 'pr-10',
              error && 'border-red-300 focus:ring-red-500',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600 font-sans">{error}</p>}
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';
export default AuthInput;
