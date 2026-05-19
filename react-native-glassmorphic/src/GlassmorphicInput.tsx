import React from 'react';
import { TextInput, StyleSheet, ViewStyle, TextStyle, StyleProp, TextInputProps } from 'react-native';
import { GlassmorphicCard } from './GlassmorphicCard';

export interface GlassmorphicInputProps extends TextInputProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'none';
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  borderRadius?: number;
}

export const GlassmorphicInput: React.FC<GlassmorphicInputProps> = ({
  intensity = 15,
  tint = 'light',
  containerStyle,
  inputStyle,
  borderRadius = 12,
  placeholderTextColor,
  ...rest
}) => {
  const getPlaceholderColor = () => {
    if (placeholderTextColor) return placeholderTextColor;
    return tint === 'dark' ? 'rgba(148, 163, 184, 0.5)' : 'rgba(71, 85, 105, 0.5)';
  };

  const getTextColor = () => {
    return tint === 'dark' ? '#F8FAFC' : '#0F172A';
  };

  return (
    <GlassmorphicCard
      intensity={intensity}
      tint={tint}
      borderRadius={borderRadius}
      borderWidth={1}
      shadowOpacity={0.03}
      elevation={0}
      style={[styles.container, containerStyle]}
    >
      <TextInput
        placeholderTextColor={getPlaceholderColor()}
        underlineColorAndroid="transparent"
        style={[
          styles.input,
          {
            color: getTextColor(),
            borderRadius,
          },
          inputStyle,
        ]}
        {...rest}
      />
    </GlassmorphicCard>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 48,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    height: '100%',
  },
});
