# react-native-pure-keyboard ⌨️

[![npm version](https://img.shields.io/npm/v/react-native-pure-keyboard.svg?style=flat-square)](https://www.npmjs.com/package/react-native-pure-keyboard)
[![license](https://img.shields.io/npm/l/react-native-pure-keyboard.svg?style=flat-square)](https://github.com/yourusername/react-native-pure-keyboard/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

A high-performance, **zero-dependency**, pure JavaScript keyboard utility for React Native and Expo. No native modules, no complex setup, just smooth keyboard handling.

## ✨ Features

- 🚀 **Zero Native Modules**: Works in Expo Go without `prebuild`.
- 🧠 **Smart Resizing**: Automatically detects Android's `adjustResize` to prevent "Double Spacing" glitches.
- ⚡ **Performant**: Uses optimized listeners and Animated API.
- 🛠 **Simple API**: Easy-to-use hooks and components.
- 📱 **Cross-Platform**: Consistent behavior across iOS and Android.

## 📦 Installation

```bash
npm install react-native-pure-keyboard
# or
yarn add react-native-pure-keyboard
```

## 🚀 Usage

### 1. The `useKeyboard` Hook
Track keyboard state anywhere in your app.

```tsx
import { useKeyboard } from 'react-native-pure-keyboard';

const MyComponent = () => {
  const { keyboardHeight, isKeyboardVisible } = useKeyboard();

  return (
    <View>
      <Text>Keyboard is {isKeyboardVisible ? 'Visible' : 'Hidden'}</Text>
      <Text>Height: {keyboardHeight}px</Text>
    </View>
  );
};
```

### 2. The `KeyboardSpacer` Component
The easiest way to avoid the keyboard. Just drop it at the bottom of your screen.

```tsx
import { KeyboardSpacer } from 'react-native-pure-keyboard';

const LoginScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {/* Your inputs here */}
      </ScrollView>
      
      {/* Expands on iOS, Smart-resizes on Android */}
      <KeyboardSpacer />
    </View>
  );
};
```

## ⚙️ API Reference

### `useKeyboard()`
Returns an object with:
- `keyboardHeight`: (number) The current height of the keyboard in pixels.
- `isKeyboardVisible`: (boolean) True if the keyboard is active.
- `keyboardDuration`: (number) The animation duration (ms).

### `<KeyboardSpacer />`
Props:
- `style`: (ViewStyle) Custom styles for the spacer.
- `offset`: (number) Extra padding (default: `0`).
- **Smart Behavior**: On Android, this component automatically stays at `0` height if your app is in `adjustResize` mode (default for Expo), preventing common layout glitches.

## 📄 License
MIT © 2024
