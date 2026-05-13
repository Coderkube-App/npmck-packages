# 🤖 AI Shroud UI

**The ultimate cloaking device for your web content.** Protect sensitive UI data from AI scrapers (GPT-4o, Claude), automated bots, and OCR extraction.

[![NPM Version](https://img.shields.io/npm/v/ai-shroud-ui.svg)](https://www.npmjs.com/package/ai-shroud-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🛡️ Why AI Shroud?

In the era of Generative AI, bots are constantly scraping websites to steal pricing, analytics, and private content. Standard bot protection (WAF) can be bypassed. **AI Shroud** takes a different approach: it makes the content **mathematically invisible** or **semantically scrambled** for bots while remaining perfectly clear for human users.

### Features
- **🖼️ Canvas Rendering**: Renders text as pixels on a canvas. Bots see an image, not text.
- **🌀 Adversarial Noise**: Adds sub-pixel noise invisible to humans that breaks OCR (Optical Character Recognition).
- **🪤 Honeypot Traps**: Injects "ghost" content into the DOM that only scrapers see, poisoning their datasets with fake data.
- **🙈 Privacy Blur**: Automatically blurs sensitive elements when the user switches tabs or leaves the window.
- **♿ Accessibility First**: Real text is still available for screen readers via ARIA and SR-only tags.

---

## 🚀 Installation

```bash
npm install ai-shroud-ui
```

## 💻 Usage

### Basic Protection (Canvas Mode)
The default mode renders text on a canvas, making it impossible to "select" or "copy" via standard DOM scrapers.

```tsx
import { AiShroud } from 'ai-shroud-ui';

function PriceComponent() {
  return (
    <div>
      Current Price: 
      <AiShroud mode="canvas" noiseLevel={0.08} style={{ color: '#ff0000', fontWeight: 'bold' }}>
        $99.99
      </AiShroud>
    </div>
  );
}
```

### Privacy Mode
Blur content automatically when the user is not actively looking at the page (e.g., in public places).

```tsx
<AiShroud blurOnInactive={true}>
  Sensitive Account Balance: $1,240.55
</AiShroud>
```

---

## ⚙️ API Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `mode` | `'canvas' \| 'svg'` | `'canvas'` | The protection method. Canvas is most secure. |
| `noiseLevel` | `number` | `0.05` | Level of adversarial noise (0 to 1). |
| `blurOnInactive`| `boolean` | `false` | Blurs content when the window loses focus. |
| `className` | `string` | `''` | Custom CSS class. |
| `style` | `CSSProperties` | `{}` | Custom inline styles (color, font, etc.). |

## 🧪 Security Breakdown

| Bot Method | How we block it |
| :--- | :--- |
| **DOM Scraper** | We remove the text from the DOM and replace it with a canvas. |
| **OCR / Vision** | We add per-pixel noise that confuses character recognition models. |
| **Dataset Training** | We inject "Honeypot" random strings that poison the AI's training data. |
| **Session Capture** | We blur the UI when the user is inactive. |

---

## 📜 License
MIT © Antigravity
