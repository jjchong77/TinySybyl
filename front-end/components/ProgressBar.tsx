import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ProgressBarProps {
  progress: number; // 0 to 1
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);
  
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.max(0, Math.min(1, progress));
  
  return (
    <View style={styles.container}>
      <View style={[styles.progressFill, { width: `${clampedProgress * 100}%` }]} />
    </View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    height: 8,
    backgroundColor: isDark ? '#334155' : '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: isDark ? '#7c3aed' : '#1a365d',
    borderRadius: 4,
  },
});