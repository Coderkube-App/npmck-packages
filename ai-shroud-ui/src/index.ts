/**
 * 🤖 AI Shroud UI
 * 
 * A professional suite of components to protect web content from 
 * automated AI extraction, scrapers, and OCR.
 */

import React, { useLayoutEffect, useRef, useState } from 'react';

// ──────────────────────────────────────────────
// 1. TYPES & CONFIG
// ──────────────────────────────────────────────

export interface ShroudProps {
  children: string;
  mode?: 'canvas' | 'svg' | 'scramble';
  blurOnInactive?: boolean;
  noiseLevel?: number; // 0 to 1
  className?: string;
  style?: React.CSSProperties;
}

// ──────────────────────────────────────────────
// 2. HELPER: SCRAMBLE LOGIC
// ──────────────────────────────────────────────

/**
 * Generates a honeypot string to confuse AI scrapers.
 */
const generateHoneypot = (length: number) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// ──────────────────────────────────────────────
// 3. CORE COMPONENT: AIShroud
// ──────────────────────────────────────────────

export const AiShroud: React.FC<ShroudProps> = ({
  children,
  mode = 'canvas',
  blurOnInactive = false,
  noiseLevel = 0.05,
  className = '',
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isBlurred, setIsBlurred] = useState(false);

  // Handle Privacy/Blur logic
  useLayoutEffect(() => {
    if (!blurOnInactive) return;

    const handleBlur = () => setIsBlurred(true);
    const handleFocus = () => setIsBlurred(false);

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [blurOnInactive]);

  // Handle Canvas Rendering (The core protection)
  useLayoutEffect(() => {
    if (mode !== 'canvas' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set font based on parent style or default
    const fontSize = 16;
    ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;
    
    // Measure text
    const metrics = ctx.measureText(children);
    canvas.width = metrics.width + 10;
    canvas.height = fontSize * 1.5;

    // Clear and Draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. Add Adversarial Noise (Confuses OCR)
    if (noiseLevel > 0) {
      for (let i = 0; i < (canvas.width * canvas.height * noiseLevel); i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.1})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // 2. Draw the actual text
    ctx.fillStyle = style.color?.toString() || '#000000';
    ctx.textBaseline = 'middle';
    ctx.fillText(children, 5, canvas.height / 2);

    // 3. Add invisible honeypot to DOM (Scrapers see this instead)
  }, [children, mode, noiseLevel, style]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    filter: isBlurred ? 'blur(8px)' : 'none',
    transition: 'filter 0.2s ease-in-out',
    ...style,
  };

  return (
    <div className={`ai-shroud-container ${className}`} style={containerStyle}>
      {/* 1. THE HUMAN VIEW (Hidden from standard DOM text scrapers) */}
      {mode === 'canvas' && (
        <canvas 
          ref={canvasRef} 
          style={{ verticalAlign: 'middle', display: 'block' }}
          aria-hidden="true" 
        />
      )}

      {mode === 'svg' && (
        <svg 
          width="100%" 
          height="1.5em" 
          viewBox={`0 0 200 30`}
          style={{ pointerEvents: 'none' }}
        >
          <text 
            x="0" 
            y="20" 
            fill={style.color?.toString() || 'currentColor'}
            style={{ font: 'inherit', userSelect: 'none' }}
          >
            {children}
          </text>
        </svg>
      )}

      {/* 2. THE BOT TRAP (Invisibly scrambled content for scrapers) */}
      <span 
        style={{
          position: 'absolute',
          opacity: 0.001,
          fontSize: '1px',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {generateHoneypot(children.length * 2)}
      </span>

      {/* 3. ACCESSIBILITY (Screen readers can still read the real text) */}
      <span className="sr-only" style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        border: 0,
      }}>
        {children}
      </span>
    </div>
  );
};

// ──────────────────────────────────────────────
// 4. HIGHER LEVEL: AiShroudGroup
// ──────────────────────────────────────────────

export const AiShroudGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="ai-shroud-group">{children}</div>;
};
