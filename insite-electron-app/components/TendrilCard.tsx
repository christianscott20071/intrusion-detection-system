
import React from 'react';

interface TendrilCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  edges?: 0 | 2 | 3;
  active?: boolean;
}

const VideoBorder: React.FC<{ 
  position: 'top' | 'left' | 'right' | 'bottom',
  thickness?: number,
  active?: boolean
}> = ({ position, thickness = 24, active = true }) => {
  const isVertical = position === 'left' || position === 'right';

  const rotationMap = {
    top: 'rotate(0deg)',
    bottom: 'rotate(180deg)',
    left: 'rotate(-90deg)',
    right: 'rotate(90deg)'
  };

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: position === 'bottom' ? 'auto' : 0,
    bottom: position === 'bottom' ? 0 : 'auto',
    left: position === 'right' ? 'auto' : 0,
    right: position === 'right' ? 0 : 'auto',
    width: isVertical ? `${thickness}px` : '100%',
    height: isVertical ? '100%' : `${thickness}px`,
    zIndex: 100,
    pointerEvents: 'none',
    overflow: 'hidden',
    opacity: active ? 1 : 0.1,
    transition: 'opacity 1.2s ease',
  };

  const videoStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: isVertical ? '2000px' : '100%', 
    height: isVertical ? `${thickness}px` : '100%',
    minWidth: '100%',
    minHeight: '100%',
    objectFit: 'cover',
    transform: `translate(-50%, -50%) ${rotationMap[position]}`,
    mixBlendMode: 'normal' as any,
    filter: active ? 'contrast(1.2) brightness(1.2)' : 'grayscale(1)',
  };

  return (
    <div style={containerStyle}>
      <video
        autoPlay
        muted
        loop
        playsInline
        style={videoStyle}
      >
        <source src="metallic_border.webm" type="video/webm" />
        <source src="./metallic_border.webm" type="video/webm" />
        <div className="w-full h-full bg-slate-400 opacity-5" />
      </video>
    </div>
  );
};

export const TendrilCard: React.FC<TendrilCardProps> = ({ 
  children, 
  title, 
  className = "", 
  edges = 0,
  active = true 
}) => {
  return (
    <div className={`relative ${className} group h-full`}>
      {/* Structural Card Surface */}
      <div className={`absolute inset-0 rounded-xl border transition-all duration-1000 z-0
        ${active 
          ? 'bg-white border-slate-200 shadow-[0_15px_45px_-20px_rgba(0,0,0,0.12)] group-hover:border-slate-300' 
          : 'bg-slate-50 border-slate-400 shadow-none'}`}></div>
      
      {/* Video Borders Layer */}
      <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden z-50">
        {edges === 3 && (active || true) && (
          <>
            <VideoBorder position="top" active={active} />
            <VideoBorder position="left" active={active} />
            <VideoBorder position="right" active={active} />
          </>
        )}

        {edges === 2 && (active || true) && (
          <>
            <VideoBorder position="top" active={active} />
            <VideoBorder position="left" active={active} />
          </>
        )}
      </div>

      {/* Main Content Area - Reduced padding for smaller displays */}
      <div className="relative p-6 lg:p-9 h-full z-10 flex flex-col">
        {title && (
          <div className="mb-6 lg:mb-10 flex items-center justify-between shrink-0">
            <div className="flex flex-col">
              <h3 className={`text-[11px] lg:text-[13px] font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] transition-colors
                ${active ? 'text-slate-500 group-hover:text-black' : 'text-slate-800'}`}>{title}</h3>
              <div className="h-[2px] lg:h-[3px] w-8 lg:w-12 bg-slate-100 mt-1 lg:mt-2 rounded-full overflow-hidden relative">
                 <div className={`absolute inset-0 energy-gradient transition-opacity duration-1000
                   ${active ? 'group-hover:opacity-100' : 'opacity-0'}`}></div>
              </div>
            </div>
            {edges > 0 && (
              <div className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-1000
                ${active 
                  ? 'energy-gradient shadow-[0_0_15px_rgba(255,169,249,0.7)] animate-pulse' 
                  : 'bg-slate-400 shadow-none scale-75'}`}></div>
            )}
          </div>
        )}
        <div className={`relative flex-1 transition-opacity duration-1000 ${!active ? 'opacity-90' : 'opacity-100'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};
