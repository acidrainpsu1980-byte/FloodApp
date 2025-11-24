import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export default function Card({ children, className = '', title }: CardProps) {
    return (
        <div className={`
      bg-[var(--surface)] 
      rounded-[var(--radius-md)] 
      shadow-[var(--shadow-md)] 
      border border-[var(--border)]
      overflow-hidden
      ${className}
    `}>
            {title && (
                <div className="px-6 py-4 border-b border-[var(--border)]">
                    <h3 className="text-lg font-semibold text-[var(--text-main)]">{title}</h3>
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}
