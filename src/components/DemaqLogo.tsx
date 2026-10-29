import React from 'react';
import { useApp } from '../context/AppContext';

export interface DemaqLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  theme?: 'dark' | 'light';
  ariaLabel?: string;
}

/**
 * High-Quality Responsive Vector Logo for DemaQ Digital Solution
 * Features the signature 'D and robot' mark with mathematical precision:
 * - Beveled hexagonal 'D' shield with left opening and vibrant amber-to-blue gradient
 * - Detailed robot mascot head with top antenna, ear sensors, visor frame, and friendly smile
 * - Signature 'DemaQ' typography with 45° golden amber slash on the 'Q'
 * - 'Digital Solution' subtext with tracked typography
 * - 100% SVG vector format ensuring zero blur, zero pixelation, and zero visual distortion
 */
export const DemaqLogo: React.FC<DemaqLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  theme: propTheme,
  ariaLabel = 'DemaQ Digital Solution'
}) => {
  const { theme: appTheme } = useApp();
  const theme = propTheme || appTheme;
  const isLight = theme === 'light';

  // Responsive height classes maintaining exact natural aspect ratios
  const sizeClasses = {
    sm: showText ? 'h-8 sm:h-9' : 'h-7 w-7 sm:h-8 sm:w-8',
    md: showText ? 'h-10 sm:h-11' : 'h-9 w-9 sm:h-10 sm:w-10',
    lg: showText ? 'h-13 sm:h-14' : 'h-12 w-12 sm:h-13 sm:w-13',
    xl: showText ? 'h-18 sm:h-20' : 'h-16 w-16 sm:h-18 sm:w-18'
  };

  const primaryTextColor = isLight ? '#0f172a' : '#f8fafc';
  const subtitleColor = isLight ? '#475569' : '#94a3b8';
  const robotHeadBg = isLight ? '#0f172a' : '#020617';

  if (!showText) {
    // Pure 'D and Robot' Mark Only (Square 96x96 viewBox, non-distorting)
    return (
      <svg
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className={`inline-block ${sizeClasses[size]} select-none ${className}`}
        role="img"
        aria-label={`${ariaLabel} - Mark`}
      >
        <defs>
          <linearGradient id="demaq-mark-shield-grad" x1="10%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="35%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
        </defs>

        {/* 1. Hexagonal Beveled 'D' with Left Opening */}
        <path
          d="
            M 16 48
            L 16 34
            L 32 14
            L 64 14
            L 90 40
            L 90 68
            L 64 94
            L 32 94
            L 16 78
            L 16 64
            L 28 64
            L 28 72
            L 38 82
            L 58 82
            L 76 64
            L 76 44
            L 58 26
            L 38 26
            L 28 36
            L 28 48
            Z
          "
          fill="url(#demaq-mark-shield-grad)"
        />

        {/* 2. Robot Mascot Inside 'D' */}
        {/* Antenna */}
        <path d="M 52 24 L 52 31" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="52" cy="22" r="2.2" fill="#f59e0b" />

        {/* Head Shell */}
        <rect
          x="34"
          y="32"
          width="36"
          height="34"
          rx="8"
          fill={robotHeadBg}
          stroke="#ffffff"
          strokeWidth="2.4"
        />

        {/* Ear Modules */}
        <rect x="30" y="42" width="4" height="14" rx="2" fill="#ffffff" />
        <rect x="70" y="42" width="4" height="14" rx="2" fill="#ffffff" />

        {/* Screen Frame */}
        <rect
          x="39"
          y="37"
          width="26"
          height="23"
          rx="5"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.6"
        />

        {/* Expressive Cyan Sensor Eyes */}
        <circle cx="46" cy="45" r="2.2" fill="#38bdf8" />
        <circle cx="58" cy="45" r="2.2" fill="#38bdf8" />

        {/* Friendly Curved Smile */}
        <path
          d="M 48 52 Q 52 55 56 52"
          stroke="#38bdf8"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }

  // Full Horizontal Responsive Vector Logo (380x96 viewBox, perfectly balanced)
  return (
    <svg
      viewBox="0 0 380 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className={`inline-block ${sizeClasses[size]} w-auto select-none ${className}`}
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        {/* 'D' Shield Gradient */}
        <linearGradient id="demaq-full-shield-grad" x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="35%" stopColor="#38bdf8" />
          <stop offset="70%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>

        {/* Signature 'Q' Slash Amber-Gold Gradient */}
        <linearGradient id="demaq-q-slash-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* ====================================================================
          1. THE 'D AND ROBOT' EMBLEM MARK
          ==================================================================== */}
      <g id="d-and-robot-mark">
        {/* Hexagonal 'D' with Left Notch Opening */}
        <path
          d="
            M 14 48
            L 14 34
            L 30 14
            L 62 14
            L 88 40
            L 88 68
            L 62 94
            L 30 94
            L 14 78
            L 14 64
            L 26 64
            L 26 72
            L 36 82
            L 56 82
            L 74 64
            L 74 44
            L 56 26
            L 36 26
            L 26 36
            L 26 48
            Z
          "
          fill="url(#demaq-full-shield-grad)"
        />

        {/* Antenna */}
        <path d="M 50 24 L 50 31" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="50" cy="22" r="2.2" fill="#f59e0b" />

        {/* Robot Head Shell */}
        <rect
          x="32"
          y="32"
          width="36"
          height="34"
          rx="8"
          fill={robotHeadBg}
          stroke="#ffffff"
          strokeWidth="2.4"
        />

        {/* Ears */}
        <rect x="28" y="42" width="4" height="14" rx="2" fill="#ffffff" />
        <rect x="68" y="42" width="4" height="14" rx="2" fill="#ffffff" />

        {/* Visor Screen */}
        <rect
          x="37"
          y="37"
          width="26"
          height="23"
          rx="5"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.6"
        />

        {/* Expressive Eyes */}
        <circle cx="44" cy="45" r="2.2" fill="#38bdf8" />
        <circle cx="56" cy="45" r="2.2" fill="#38bdf8" />

        {/* Smile */}
        <path
          d="M 46 52 Q 50 55 54 52"
          stroke="#38bdf8"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* ====================================================================
          2. BRAND TYPOGRAPHY: "DemaQ" + "Digital Solution"
          ==================================================================== */}
      <g id="brand-typography">
        {/* "Dema" Primary Title */}
        <text
          x="108"
          y="56"
          fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
          fontSize="48"
          fontWeight="800"
          letterSpacing="-0.03em"
          fill={primaryTextColor}
        >
          Dema
        </text>

        {/* Letter 'Q' with Integrated Amber-Gold Slash */}
        <g id="letter-q-mark">
          {/* Round Bowl of Q */}
          <circle
            cx="276"
            cy="41"
            r="16.5"
            stroke={primaryTextColor}
            strokeWidth="7.5"
            fill="none"
          />
          {/* Signature 45° Golden Amber Slash Tail */}
          <line
            x1="272"
            y1="41"
            x2="295"
            y2="64"
            stroke="url(#demaq-q-slash-grad)"
            strokeWidth="7.5"
            strokeLinecap="round"
          />
        </g>

        {/* "Digital Solution" Subtitle with Professional Tracking */}
        <text
          x="110"
          y="81"
          fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
          fontSize="18"
          fontWeight="700"
          letterSpacing="0.14em"
          fill={subtitleColor}
        >
          DIGITAL SOLUTION
        </text>
      </g>
    </svg>
  );
};
