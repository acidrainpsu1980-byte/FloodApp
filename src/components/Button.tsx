import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] focus:ring-[var(--primary)]",
        secondary: "bg-[var(--secondary)] text-white hover:bg-[var(--secondary-hover)] focus:ring-[var(--secondary)]",
        outline: "border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white focus:ring-[var(--primary)]",
        ghost: "text-[var(--text-secondary)] hover:bg-slate-100 hover:text-[var(--text-main)]",
    };

    const sizes = {
        sm: "text-sm px-3 py-1.5 rounded-[var(--radius-sm)]",
        md: "text-base px-4 py-2 rounded-[var(--radius-sm)]",
        lg: "text-lg px-6 py-3 rounded-[var(--radius-md)]",
    };

    const width = fullWidth ? "w-full" : "";

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
