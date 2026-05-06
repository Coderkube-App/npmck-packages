# CoderKube Packages

A collection of production-ready packages built for modern web and mobile applications.
This repository contains utilities focused on security, encrypted storage, keyboard management, and browser protection for React, React Native, Next.js, Expo, and Vanilla JavaScript applications.

---

# Packages

## 1. Bot-Proof Storage

High-security browser storage library with built-in behavioral bot detection and encrypted client-side persistence.

### Features

* AES-256 Encryption
* Behavioral Bot Detection
* Automatic Storage Sanitization
* LocalStorage & SessionStorage Support
* SSR-Safe Implementation

### Installation

```bash
npm install bot-proof-storage
```

### Basic Usage

```javascript
import { BotProofStorage } from 'bot-proof-storage';

const storage = new BotProofStorage({
  secretKey: 'your-secret-key',
  storageType: 'local',
  autoWipeOnBot: true
});

storage.setItem('session', {
  token: 'xyz123'
});
```

### Use Cases

* Authentication token protection
* Anti-bot systems
* Secure browser sessions
* Fraud prevention applications

---

## 2. React Native Pure Keyboard

A lightweight and zero-dependency keyboard utility for React Native and Expo.

### Features

* Zero Native Modules
* Expo Compatible
* Smart Keyboard Resizing
* Cross-Platform Support
* Animated Keyboard Handling

### Installation

```bash
npm install react-native-pure-keyboard
```

### Basic Usage

```tsx
import { KeyboardSpacer } from 'react-native-pure-keyboard';

function App() {
  return (
    <>
      {/* Your Screen */}
      <KeyboardSpacer />
    </>
  );
}
```

### Use Cases

* Forms & input screens
* Chat applications
* Keyboard-aware layouts
* Expo applications

---

## 3. React Stop Inspect

Browser inspection and DevTools protection library for React and modern web applications.

### Features

* Disable Right Click
* Disable DevTools Shortcuts
* Console Protection
* Debugger Loop Detection
* Resize-Based DevTools Detection

### Installation

```bash
npm install react-stop-inspect
```

### Basic Usage

```tsx
import { useStopInspect } from 'react-stop-inspect';

function App() {
  useStopInspect();

  return <div>Protected App</div>;
}
```

### Supported Platforms

* React
* Vite
* Next.js
* Webpack
* Vanilla JavaScript

---

## 4. Safe Session Storage

Secure encrypted storage wrapper for Web and React Native applications.

### Features

* Automatic Encryption
* SSR Friendly
* React Native Support
* TypeScript Support
* Lightweight Implementation

### Installation

```bash
npm install safe-session-storage
```

### Basic Usage

```tsx
import { useSafeStorage } from 'safe-session-storage';

function App() {
  const [theme, setTheme] = useSafeStorage('theme', 'light');
}
```

### Supported Platforms

* React
* Next.js
* React Native
* Node.js

---

# Tech Stack

* JavaScript / TypeScript
* React
* React Native
* Next.js
* Expo
* Browser Storage APIs

---

# Repository Structure

```text
packages/
├── bot-proof-storage/
├── react-native-pure-keyboard/
├── react-stop-inspect/
└── safe-session-storage/
```

---

# Installation

Clone the repository:

```bash
git clone https://github.com/Coderkube-App/npmck-packages
```

Install dependencies:

```bash
npm install
```

---

# Purpose

This repository provides reusable utilities for:

* Secure client-side storage
* Bot and inspection prevention
* Keyboard management
* Cross-platform support
* Production-ready React & React Native systems

---

# Contribution

Contributions, improvements, and pull requests are welcome.

---

# License

All packages are licensed under the Apache-2.0 License.
