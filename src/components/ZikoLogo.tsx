import React from 'react';

interface ZikoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ZikoLogo: React.FC<ZikoLogoProps> = ({ className = '', size = 'md' }) => {
  const dim =
    size === 'sm'
      ? 'w-10 h-10'
      : size === 'md'
      ? 'w-14 h-14'
      : size === 'lg'
      ? 'w-24 h-24'
      : 'w-32 h-32';

  return (
    <div
      className={`relative ${dim} rounded-2xl overflow-hidden border-2 border-red-700/80 shadow-[0_0_25px_rgba(153,27,27,0.65)] bg-black shrink-0 transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
    >
      <img
        src="/nemar-logo.jpg"
        alt="NEMAR"
        className="w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-red-950/30 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export const NemarLogo = ZikoLogo;
