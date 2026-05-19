import React from 'react';
import { TouchableOpacity, StyleSheet, Text, TextStyle, ViewStyle, StyleProp, ActivityIndicator } from 'react-native';
import { GlassmorphicCard } from './GlassmorphicCard';

export interface GlassmorphicButtonProps {
  onPress?: () => void;
  title: string;
  intensity?: number;
  tint?: 'light' | 'dark' | 'none';
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  borderRadius?: number;
  loading?: boolean;
  disabled?: boolean;
}

export const GlassmorphicButton: React.FC<GlassmorphicButtonProps> = ({
  onPress,
  title,
  intensity = 30,
  tint = 'light',
  containerStyle,
  textStyle,
  borderRadius = 12,
  loading = false,
  disabled = false,
}) => {
  const getTextColor = () => {
    if (disabled) return tint === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
    return tint === 'dark' ? '#FFFFFF' : '#0F172A';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={styles.touchable}
    >
      <GlassmorphicCard
        intensity={intensity}
        tint={tint}
        borderRadius={borderRadius}
        borderWidth={1}
        shadowOpacity={disabled ? 0.01 : 0.05}
        elevation={0}
        style={[
          styles.card,
          disabled && styles.disabledCard,
          containerStyle,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={getTextColor()} />
        ) : (
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
        )}
      </GlassmorphicCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
  },
  card: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  disabledCard: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
