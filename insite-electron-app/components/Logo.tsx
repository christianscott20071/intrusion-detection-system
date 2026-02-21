
import React from 'react';

interface LogoProps {
  active?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ active = true }) => {
  return (
    <div
  className={`logo-container relative flex items-center justify-center
    w-16 h-16
    sm:w-18 sm:h-18
    lg:w-24 lg:h-24
    select-none transition-all duration-700
    ${!active ? 'opacity-30 grayscale' : ''}
  `}
>

      {/* 
        Referencing the logo in the assets folder relative to the root index.html.
        The drop-shadow provides a clean 'glow' effect for PNG transparency.
      */}
      <img
        src="./assets/EyeLogo.png"
        alt="Insite Logo"
        className={`w-full h-full object-contain transition-all duration-500 ${
          active ? 'drop-shadow-[0_0_15px_rgba(255,169,249,0.5)]' : ''
        }`}
      />

      {/* Subtle atmospheric glow behind the PNG */}
      {active && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#fff7ad]/20 to-[#ffa9f9]/20 rounded-full blur-2xl -z-10 animate-pulse" />
      )}
    </div>
  );
};
