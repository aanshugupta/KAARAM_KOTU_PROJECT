
import React, { useMemo, useEffect, useState } from 'react';
import Snowfall from 'react-snowfall';

interface SnowEffectProps {
  density?: 'full' | 'reduced' | 'minimal';
}

const SnowEffect: React.FC<SnowEffectProps> = ({ density = 'full' }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const snowflakeCount = useMemo(() => {
    const base = isMobile ? 40 : 100; // Increased base count for more prominence
    if (density === 'reduced') return Math.floor(base * 0.5);
    if (density === 'minimal') return Math.floor(base * 0.15);
    return base;
  }, [isMobile, density]);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[1100] overflow-hidden" 
      style={{ opacity: density === 'minimal' ? 0.3 : 0.7 }}
    >
      <Snowfall
        color="#ffffff"
        snowflakeCount={snowflakeCount}
        radius={[0.5, 2.5]}
        speed={[0.5, 1.5]}
        wind={[-0.2, 0.2]}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
        }}
      />
    </div>
  );
};

export default SnowEffect;
