/**
 * 🤖 AI Shroud UI - React Wrapper
 * 
 * Protects React-based UI content from AI scrapers and OCR.
 */

import React, { useLayoutEffect, useRef, useState } from 'react';
import { renderToCanvas, generateHoneypot, ShroudOptions } from './vanilla';

export interface ShroudProps extends ShroudOptions {
  children: string;
  blurOnInactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const AiShroud: React.FC<ShroudProps> = ({
  children,
  mode = 'canvas',
  blurOnInactive = false,
  noiseLevel = 0.05,
  className = '',
  style = {},
  fontFamily,
  fontSize
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

  // Use the Vanilla engine for rendering
  useLayoutEffect(() => {
    if (mode !== 'canvas' || !canvasRef.current) return;

    renderToCanvas(canvasRef.current, children, {
      noiseLevel,
      color: style.color?.toString() || '#000000',
      fontSize: fontSize || 16,
      fontFamily: fontFamily || 'Inter, system-ui, sans-serif'
    });
  }, [children, mode, noiseLevel, style, fontSize, fontFamily]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    filter: isBlurred ? 'blur(8px)' : 'none',
    transition: 'filter 0.2s ease-in-out',
    ...style,
  };

  return (
    <div className={`ai-shroud-container ${className}`} style={containerStyle}>
      {/* 1. THE HUMAN VIEW */}
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

      {/* 2. THE BOT TRAP */}
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

      {/* 3. ACCESSIBILITY */}
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
