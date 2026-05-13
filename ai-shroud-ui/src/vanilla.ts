/**
 * 🤖 AI Shroud UI - Vanilla Engine
 * Pure JavaScript protection logic for any web platform.
 */

export interface ShroudOptions {
  mode?: 'canvas' | 'svg';
  noiseLevel?: number;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
}

/**
 * Generates a honeypot string to confuse AI scrapers.
 */
export const generateHoneypot = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Core rendering logic for Canvas-based protection.
 */
export const renderToCanvas = (
  canvas: HTMLCanvasElement,
  text: string,
  options: ShroudOptions = {}
) => {
  const {
    noiseLevel = 0.05,
    color = '#000000',
    fontSize = 16,
    fontFamily = 'Inter, system-ui, sans-serif'
  } = options;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.font = `${fontSize}px ${fontFamily}`;
  const metrics = ctx.measureText(text);
  
  // Set dimensions
  canvas.width = metrics.width + 10;
  canvas.height = fontSize * 1.5;

  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Adversarial Noise (OCR protection)
  if (noiseLevel > 0) {
    for (let i = 0; i < (canvas.width * canvas.height * noiseLevel); i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.1})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // 2. Render Text
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 5, canvas.height / 2);
};

/**
 * Universal protect function for Vanilla JS
 */
export const protect = (element: HTMLElement, text: string, options: ShroudOptions = {}) => {
  const mode = options.mode || 'canvas';
  
  element.innerHTML = ''; // Clear
  element.style.position = 'relative';
  element.style.display = 'inline-block';

  if (mode === 'canvas') {
    const canvas = document.createElement('canvas');
    canvas.style.verticalAlign = 'middle';
    canvas.style.display = 'block';
    canvas.setAttribute('aria-hidden', 'true');
    element.appendChild(canvas);
    renderToCanvas(canvas, text, options);
  }

  // Add Bot Trap
  const trap = document.createElement('span');
  Object.assign(trap.style, {
    position: 'absolute',
    opacity: '0.001',
    fontSize: '1px',
    pointerEvents: 'none',
    userSelect: 'none',
  });
  trap.textContent = generateHoneypot(text.length * 2);
  element.appendChild(trap);

  // Add Screen Reader Text
  const sr = document.createElement('span');
  Object.assign(sr.style, {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    border: '0',
  });
  sr.textContent = text;
  element.appendChild(sr);
};
