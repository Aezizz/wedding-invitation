import React, { useMemo } from 'react';
import './FallingPetals.css';

function FallingPetals({ count = 10, startDelay = 0 }) {
  const petals = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 10 + Math.random() * 14,
      duration: 9 + Math.random() * 8,
      drift: (Math.random() - 0.5) * 160,
      delay: startDelay + Math.random() * 6,
    }));
  }, [count, startDelay]);

  return (
    <div className="petals" aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: `${p.left}vw`,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--drift': `${p.drift}px`,
          }}
        >
          ❀
        </div>
      ))}
    </div>
  );
}

export default FallingPetals;
