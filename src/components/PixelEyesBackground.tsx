import React, { useEffect, useState } from 'react';

interface PixelEyesBackgroundProps {
  isLight: boolean;
}

// Pixel grid definition for a single digital eye (8x6 matrix where 1 = LED diode pixel, 2 = Pupil pixel)
// Left eye matrix
const LEFT_EYE_MATRIX = [
  [0, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 2, 2, 1, 1, 1, 1],
  [1, 1, 2, 2, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0],
];

// Right eye matrix
const RIGHT_EYE_MATRIX = [
  [0, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 2, 2, 1, 1],
  [1, 1, 1, 1, 2, 2, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0],
];

// Fixed position pairs scattered across screen background
const EYE_PAIRS = [
  { id: 'eye-top-right', top: '12%', left: '82%', scale: 0.85, blinkDelay: '0s', lookDuration: '6s', opacity: 0.28 },
  { id: 'eye-mid-left', top: '34%', left: '5%', scale: 0.75, blinkDelay: '2.4s', lookDuration: '7.5s', opacity: 0.22 },
  { id: 'eye-hero-right', top: '22%', left: '92%', scale: 0.65, blinkDelay: '1.2s', lookDuration: '5.8s', opacity: 0.18 },
  { id: 'eye-mid-right', top: '58%', left: '88%', scale: 0.9, blinkDelay: '3.1s', lookDuration: '8s', opacity: 0.25 },
  { id: 'eye-lower-left', top: '76%', left: '8%', scale: 0.8, blinkDelay: '4.2s', lookDuration: '6.8s', opacity: 0.20 },
  { id: 'eye-bottom-right', top: '88%', left: '80%', scale: 0.7, blinkDelay: '1.8s', lookDuration: '7.2s', opacity: 0.24 },
];

export const PixelEyesBackground: React.FC<PixelEyesBackgroundProps> = ({ isLight }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse tracking for subtle pupil parallax shift
  useEffect(() => {
    let ticking = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Normalize mouse position between -6px and +6px offset
          const offsetX = Math.max(-6, Math.min(6, (e.clientX / window.innerWidth - 0.5) * 12));
          const offsetY = Math.max(-4, Math.min(4, (e.clientY / window.innerHeight - 0.5) * 8));
          setMousePos({ x: offsetX, y: offsetY });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Theme colors
  const primaryPixelColor = isLight ? '#f97316' : '#38bdf8'; // Warm Orange / Cyber Cyan
  const pupilColor = isLight ? '#ea580c' : '#0284c7';        // Deep Amber / Deep Cyan
  const glowColor = isLight ? 'rgba(249, 115, 22, 0.4)' : 'rgba(56, 189, 248, 0.45)';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* Dynamic Keyframe Animations defined inline for zero CSS overhead */}
      <style>{`
        @keyframes pixelEyeBlink {
          0%, 94%, 100% {
            transform: scaleY(1);
          }
          96% {
            transform: scaleY(0.08);
          }
        }

        @keyframes pixelEyePulse {
          0%, 100% {
            filter: drop-shadow(0 0 3px ${glowColor});
          }
          50% {
            filter: drop-shadow(0 0 8px ${glowColor});
          }
        }
      `}</style>

      {EYE_PAIRS.map((pair) => (
        <div
          key={pair.id}
          className="absolute transition-opacity duration-500"
          style={{
            top: pair.top,
            left: pair.left,
            opacity: pair.opacity,
            transform: `scale(${pair.scale})`,
            animation: `pixelEyePulse ${pair.lookDuration} ease-in-out infinite`,
          }}
        >
          {/* Pair Wrapper with Blinking animation */}
          <div
            className="flex items-center gap-3"
            style={{
              animation: `pixelEyeBlink 5.5s ease-in-out ${pair.blinkDelay} infinite`,
              transformOrigin: 'center center',
            }}
          >
            {/* Left Eye SVG Matrix */}
            <svg
              width="40"
              height="30"
              viewBox="0 0 40 30"
              className="overflow-visible"
            >
              {LEFT_EYE_MATRIX.map((row, rIdx) =>
                row.map((pixel, cIdx) => {
                  if (pixel === 0) return null;
                  const isPupil = pixel === 2;
                  const px = cIdx * 5 + (isPupil ? mousePos.x : 0);
                  const py = rIdx * 5 + (isPupil ? mousePos.y : 0);

                  return (
                    <rect
                      key={`l-${rIdx}-${cIdx}`}
                      x={px}
                      y={py}
                      width="4.2"
                      height="4.2"
                      rx="0.8"
                      fill={isPupil ? pupilColor : primaryPixelColor}
                    />
                  );
                })
              )}
            </svg>

            {/* Right Eye SVG Matrix */}
            <svg
              width="40"
              height="30"
              viewBox="0 0 40 30"
              className="overflow-visible"
            >
              {RIGHT_EYE_MATRIX.map((row, rIdx) =>
                row.map((pixel, cIdx) => {
                  if (pixel === 0) return null;
                  const isPupil = pixel === 2;
                  const px = cIdx * 5 + (isPupil ? mousePos.x : 0);
                  const py = rIdx * 5 + (isPupil ? mousePos.y : 0);

                  return (
                    <rect
                      key={`r-${rIdx}-${cIdx}`}
                      x={px}
                      y={py}
                      width="4.2"
                      height="4.2"
                      rx="0.8"
                      fill={isPupil ? pupilColor : primaryPixelColor}
                    />
                  );
                })
              )}
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};
