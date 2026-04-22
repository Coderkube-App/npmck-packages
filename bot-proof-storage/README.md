# 🛡️ Bot-Proof Storage

**The world's first storage library with Active Behavioral Defense.**

`bot-proof-storage` is a high-security storage wrapper for `localStorage` and `sessionStorage`. It doesn't just encrypt your data with **AES-256**; it actively monitors user behavior to detect bots, scrapers, and automated scripts.

## ✨ Key Features

- **AES-256 Encryption**: Military-grade protection for your data.
- **Behavioral Biometrics**: Detects bots by analyzing mouse linearity, velocity, and interaction cadence.
- **Active Defense (Auto-Sanitize)**: Automatically wipes sensitive storage if a bot is detected.
- **SSR Safe**: Built-in protection for Next.js and Server-Side Rendering.
- **Lightweight**: Zero dependencies (uses `crypto-js` for robust encryption).

## 🚀 Installation

```bash
npm install bot-proof-storage
```

## 💻 Usage

### Basic Setup (React / Next.js / Vanilla JS)

```javascript
import { BotProofStorage } from 'bot-proof-storage';

const storage = new BotProofStorage({
  secretKey: 'your-very-secret-key',
  storageType: 'local', // or 'session'
  sensitivity: 0.5,     // 0.1 (relaxed) to 1.0 (strict)
  autoWipeOnBot: true,  // Automatically clear storage if bot is detected
  onBotDetected: () => {
    console.error("🚨 Security Alert: Bot behavior detected!");
    // You can also trigger a logout or log the event to your backend here
  }
});

// Save data securely
storage.setItem('user_session', { token: 'xyz123', role: 'admin' });

// Retrieve data (will return null if bot was detected)
const data = storage.getItem('user_session');
```

## 🧠 How the Bot Detection Works

The library monitors three specific behavioral signatures:

1. **Linearity**: Humans move mice in curves. Bots often move in perfectly straight lines. `bot-proof-storage` calculates the geometric area of movement triangles to detect linear patterns.
2. **Velocity**: Humans have physical limits. If interactions (clicks/keypresses) occur at inhuman speeds (e.g., < 20ms), the system flags the behavior.
3. **Cadence**: Automated scripts often have a "perfect" rhythm. The library detects unnatural timing patterns.

## 🔒 Security Policy

If `autoWipeOnBot` is enabled, any confirmed bot detection will trigger a `storage.clear()`, effectively "self-destructing" any sensitive tokens before a malicious script can extract them.

## 📄 License

MIT © [Your Name/Company]
