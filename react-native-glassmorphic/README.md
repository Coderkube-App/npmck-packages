# react-native-glassmorphic 🔮

A high-performance, responsive, hybrid native & CSS **Glassmorphism** layout library for React Native and Expo (iOS, Android, and Web).

This package delivers beautiful frosted glass UI components (Cards, Inputs, Buttons) that automatically tap into high-fidelity native system blur on iOS (`expo-blur` / `@react-native-community/blur`) while utilizing optimized, zero-overhead CSS gradients and highlights as fallbacks on Android and Web to prevent UI stutter.

---

## Features

* **Hybrid Engine**: Uses ultra-smooth native blur effects on iOS and CSS translucent layered masks as fallbacks on Android & Web.
* **Liquid 60FPS**: Designed specifically for high-performance layout rendering without screen redraw lag.
* **Fully Responsive**: Adapts fluidly to all mobile device viewports and standard styles.
* **Expo Ready**: Installs with zero native modules or linking required for managed Expo environments.
* **Pre-Built Elements**: Ready-to-use frosted elements: `GlassmorphicCard`, `GlassmorphicInput`, and `GlassmorphicButton`.

---

## Installation

```bash
npm install react-native-glassmorphic
```

*(Optional)* For native hardware blur on iOS, you can also install `expo-blur`:
```bash
npx expo install expo-blur
```

---

## Usage

### 1. Glassmorphic Card Container

Create beautiful backdrop layouts, custom menus, or profile grids:

```tsx
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { GlassmorphicCard } from 'react-native-glassmorphic';

export default function ProfileCard() {
  return (
    <GlassmorphicCard 
      intensity={30} 
      tint="light" 
      borderRadius={20}
      style={styles.card}
    >
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Premium Membership Active</Text>
    </GlassmorphicCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 24,
    width: 320,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(15, 23, 42, 0.7)',
    marginTop: 6,
  },
});
```

### 2. Glassmorphic Text Input

Create gorgeous, modern search fields and form items:

```tsx
import React, { useState } from 'react';
import { GlassmorphicInput } from 'react-native-glassmorphic';

export default function SearchField() {
  const [query, setQuery] = useState('');

  return (
    <GlassmorphicInput
      value={query}
      onChangeText={setQuery}
      placeholder="Search transaction history..."
      tint="light"
      intensity={20}
    />
  );
}
```

### 3. Glassmorphic Button

Interactive, frosted buttons with dynamic loading indicators:

```tsx
import React from 'react';
import { GlassmorphicButton } from 'react-native-glassmorphic';

export default function ActionButton() {
  return (
    <GlassmorphicButton
      title="Unlock Premium Pack"
      tint="dark"
      intensity={40}
      onPress={() => console.log('Unlocked!')}
    />
  );
}
```

---

## Component API Reference

### `GlassmorphicCard` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `children` | `React.ReactNode` | `undefined` | The child elements inside the card. |
| `intensity` | `number` | `20` | Blur amount (0 to 100) mapped to iOS Blur and Android opacity. |
| `tint` | `'light' \| 'dark' \| 'none'` | `'light'` | Theme color styling. |
| `borderRadius` | `number` | `16` | Border radius of the card. |
| `borderWidth` | `number` | `1` | Border width of the card. |
| `borderColor` | `string` | *Computed* | Semi-translucent custom border color. |
| `shadowOpacity` | `number` | `0.1` | Shadow strength baseline. |
| `elevation` | `number` | `4` (or `0` if `tint="none"`) | Android-specific elevation shadow. |
| `style` | `StyleProp<ViewStyle>` | `undefined` | Style overrides for the outer container. |

---

### `GlassmorphicInput` Props

*Extends standard React Native [TextInputProps](https://reactnative.dev/docs/textinput#props).*

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `intensity` | `number` | `15` | Blur amount (0 to 100) mapped to iOS Blur and Android opacity. |
| `tint` | `'light' \| 'dark' \| 'none'` | `'light'` | Theme color styling. |
| `borderRadius` | `number` | `12` | Border radius of the input container. |
| `containerStyle` | `StyleProp<ViewStyle>` | `undefined` | Style overrides for the wrapping card/container. |
| `inputStyle` | `StyleProp<TextStyle>` | `undefined` | Style overrides for the inner `TextInput` component. |

---

### `GlassmorphicButton` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | *Required* | Button display text. |
| `onPress` | `() => void` | `undefined` | Callback fired when the button is pressed. |
| `intensity` | `number` | `30` | Blur amount (0 to 100) mapped to iOS Blur and Android opacity. |
| `tint` | `'light' \| 'dark' \| 'none'` | `'light'` | Theme color styling. |
| `borderRadius` | `number` | `12` | Border radius of the button. |
| `loading` | `boolean` | `false` | When true, renders an `ActivityIndicator` in place of the text. |
| `disabled` | `boolean` | `false` | When true, disables interactions and reduces opacity. |
| `containerStyle` | `StyleProp<ViewStyle>` | `undefined` | Style overrides for the button card/container. |
| `textStyle` | `StyleProp<TextStyle>` | `undefined` | Style overrides for the button text label. |

---

## Strategic Styling Advice

For optimal visual glass effects:
1. **Bright Backgrounds**: Place Glassmorphic elements on top of rich gradient, colorful, or busy photo backgrounds. Frosted effects are more pronounced when there are strong color transitions underneath.
2. **Double Highlights**: Combine bright background layers with custom `shadowColor` properties to increase visual depth.

---

## License

This package is licensed under the MIT License.
