import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label className="text-sm font-medium text-[var(--text-main)]">
                    {label}
                </label>
            )}
            <input
                className={`
          w-full px-4 py-2 
          border border-[var(--border)] 
          rounded-[var(--radius-sm)] 
          bg-white 
          text-[var(--text-main)]
          placeholder-[var(--text-secondary)]
          focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
          transition-all
          ${error ? 'border-[var(--error)] focus:ring-[var(--error)]' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <span className="text-xs text-[var(--error)]">{error}</span>
            )}
        </div>
    );
}
