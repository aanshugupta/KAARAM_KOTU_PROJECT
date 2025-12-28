
import React from 'react';
import { Sparkle } from 'lucide-react';

interface EditorialMarqueeProps {
  text: string;
  direction?: 'left' | 'right';
  speed?: number; // duration in seconds
  fontSize?: string;
  opacity?: number;
  className?: string;
  outline?: boolean;
  label?: string; // Optional static label for context
  withIcon?: boolean; // Use icon instead of dot separator
}

const EditorialMarquee: React.FC<EditorialMarqueeProps> = ({ 
  text, 
  direction = 'left', 
  speed = 40, 
  fontSize = 'text-3xl md:text-5xl', 
  opacity = 1,
  className = '',
  outline = false,
  label,
  withIcon = false
}) => {
  const separator = withIcon ? (
    <Sparkle size={18} className="mx-6 text-gold/40" strokeWidth={1} />
  ) : (
    <span className="mx-6 opacity-30">•</span>
  );

  return (
    <div 
      className={`marquee-outer relative overflow-hidden flex flex-col select-none z-20 ${className}`}
    >
      {/* Subtle Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
      
      {/* Optional Static Label */}
      {label && (
        <div className="container mx-auto px-6 pt-6 pb-0">
          <span className="text-[9px] font-bold text-gold uppercase tracking-[0.4em] block text-center lg:text-left">
            {label}
          </span>
        </div>
      )}

      <div className="marquee-container relative overflow-hidden whitespace-nowrap py-6 flex items-center">
        <div 
          className={`flex shrink-0 items-center min-w-full ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}
          style={{ 
            '--duration': `${speed}s`,
            opacity: opacity 
          } as React.CSSProperties}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span 
                className={`${fontSize} font-bold serif uppercase tracking-[0.3em] transition-all ${outline ? 'text-transparent' : 'text-olive'}`}
                style={outline ? { WebkitTextStroke: '1px #3d4a3e' } : {}}
              >
                {text}
              </span>
              {separator}
            </div>
          ))}
          {/* Repeat for seamless loop */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i + 8} className="flex items-center shrink-0">
              <span 
                className={`${fontSize} font-bold serif uppercase tracking-[0.3em] transition-all ${outline ? 'text-transparent' : 'text-olive'}`}
                style={outline ? { WebkitTextStroke: '1px #3d4a3e' } : {}}
              >
                {text}
              </span>
              {separator}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorialMarquee;
