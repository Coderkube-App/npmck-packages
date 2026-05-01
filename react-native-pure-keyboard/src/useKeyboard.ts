import { useEffect, useState, useRef } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

export interface KeyboardState {
  keyboardHeight: number;
  isKeyboardVisible: boolean;
  keyboardDuration: number;
}

/**
 * A hook that tracks the keyboard state in real-time.
 * Works seamlessly on iOS and Android.
 */
export const useKeyboard = (): KeyboardState => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardDuration, setKeyboardDuration] = useState(0);

  useEffect(() => {
    const onKeyboardShow = (e: KeyboardEvent) => {
      // Use endCoordinates for accuracy
      const height = e.endCoordinates ? e.endCoordinates.height : 0;
      const duration = e.duration || 250;

      setKeyboardHeight(height);
      setKeyboardVisible(true);
      setKeyboardDuration(duration);
    };

    const onKeyboardHide = (e: KeyboardEvent) => {
      const duration = e.duration || 250;
      
      setKeyboardHeight(0);
      setKeyboardVisible(false);
      setKeyboardDuration(duration);
    };

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, onKeyboardShow);
    const hideSubscription = Keyboard.addListener(hideEvent, onKeyboardHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return {
    keyboardHeight,
    isKeyboardVisible,
    keyboardDuration,
  };
};
