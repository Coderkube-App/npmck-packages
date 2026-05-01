import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp, Platform } from 'react-native';
import { useKeyboard } from './useKeyboard';

interface KeyboardSpacerProps {
  style?: StyleProp<ViewStyle>;
  /**
   * Offset to add/subtract from the keyboard height.
   * Useful if you have a bottom tab bar or extra padding.
   */
  offset?: number;
}

/**
 * A smooth, animated spacer that expands when the keyboard is visible.
 * Drop this at the bottom of your screen.
 */
export const KeyboardSpacer: React.FC<KeyboardSpacerProps> = ({ 
  style, 
  offset = 0 
}) => {
  const { keyboardHeight, keyboardDuration } = useKeyboard();
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // On Android, if using adjustResize (default), the system already shrinks the view.
    // Adding the keyboardHeight again causes "double spacing". 
    // We only apply the height on iOS, but keep the offset for both.
    const targetHeight = Platform.OS === 'ios' ? keyboardHeight : 0;

    Animated.timing(animatedHeight, {
      toValue: Math.max(0, targetHeight + offset),
      duration: keyboardDuration,
      useNativeDriver: false,
    }).start();
  }, [keyboardHeight, offset, keyboardDuration]);

  const AnimatedView = Animated.View as any;

  return (
    <AnimatedView 
      style={[
        { height: animatedHeight as any },
        style
      ]} 
    />
  );
};
