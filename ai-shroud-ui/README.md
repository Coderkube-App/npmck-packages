# AI Shroud UI

Protect sensitive UI content from AI scrapers, bots, and OCR extraction.

## Installation

```bash
npm install ai-shroud-ui
```

## Usage

### React Components

```tsx
import { AiShroud, AiShroudGroup } from 'ai-shroud-ui';

function App() {
  return (
    <AiShroudGroup>
      <AiShroud mode="canvas" noiseLevel={0.05}>
        Protected Content
      </AiShroud>

      <AiShroud mode="svg" blurOnInactive>
        Sensitive Data
      </AiShroud>
    </AiShroudGroup>
  );
}
```

### Vanilla JS (Framework-Agnostic)

```tsx
import { protect } from 'ai-shroud-ui/vanilla';

const el = document.getElementById('content');
protect(el, 'Protected Text', {
  mode: 'canvas',
  noiseLevel: 0.05,
});
```

## API Reference

### React Props

| Prop            | Type                            | Default   | Description                                      |
| :-------------- | :------------------------------ | :-------- | :----------------------------------------------- |
| `mode`          | `'canvas' \| 'svg' \| 'scramble'` | `'canvas'` | Protection method. Canvas is most secure.      |
| `noiseLevel`    | `number`                        | `0.05`    | Level of adversarial noise (0 to 1).            |
| `blurOnInactive` | `boolean`                      | `false`   | Blurs content when the window loses focus.      |
| `className`     | `string`                        | `''`      | Custom CSS class.                                |
| `style`         | `CSSProperties`                 | `{}`      | Custom inline styles (color, font, etc.).        |

### Vanilla Options

```ts
interface ShroudOptions {
  mode?: 'canvas' | 'svg';
  noiseLevel?: number;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
}
```

### Exports

| Export             | Description                              |
| :----------------- | :--------------------------------------- |
| `AiShroud`         | Main React protection component          |
| `AiShroudGroup`    | Wrapper for grouping protected content   |
| `protect`          | Vanilla JS protection function           |
| `renderToCanvas`   | Canvas rendering utility                 |
| `generateHoneypot` | Honeypot string generator                |

## License

MIT