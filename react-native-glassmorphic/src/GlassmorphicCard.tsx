import React from 'react';
import { View, StyleSheet, ViewStyle, Platform, StyleProp } from 'react-native';

// Dynamically load Expo BlurView or @react-native-community/blur if available
let BlurView: any = null;
try {
  const ExpoBlur = require('expo-blur');
  BlurView = ExpoBlur.BlurView;
} catch {
  try {
    const CommunityBlur = require('@react-native-community/blur');
    BlurView = CommunityBlur.BlurView;
  } catch {
    // Non-native environment, fallback to CSS styling
  }
}

export interface GlassmorphicCardProps {
  children?: React.ReactNode;
  intensity?: number; // 0 to 100
  tint?: 'light' | 'dark' | 'none';
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  shadowOpacity?: number;
  elevation?: number;
}

export const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  intensity = 20,
  tint = 'light',
  style,
  borderRadius = 16,
  borderWidth = 1,
  borderColor,
  shadowOpacity = 0.1,
  elevation,
}) => {
  const getFallbackBackground = () => {
    if (tint === 'dark') {
      const alpha = 0.15 + intensity / 300; // 0.15 to 0.48
      return `rgba(15, 23, 42, ${alpha})`;
    } else if (tint === 'light') {
      const alpha = 0.08 + intensity / 400; // 0.08 to 0.33
      return `rgba(255, 255, 255, ${alpha})`;
    }
    return 'transparent';
  };

  const getBorderColor = () => {
    if (borderColor) return borderColor;
    return tint === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.35)';
  };

  const cardStyle = [
    styles.card,
    {
      borderRadius,
      borderWidth,
      borderColor: getBorderColor(),
      shadowOpacity,
      shadowRadius: borderRadius,
      elevation: elevation !== undefined ? elevation : (tint === 'none' ? 0 : 4),
    },
    style,
  ];

  if (BlurView && Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={intensity}
        tint={tint === 'none' ? 'default' : tint}
        style={cardStyle}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <View
      style={[
        {
          backgroundColor: getFallbackBackground(),
        },
        cardStyle,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
  },
});
