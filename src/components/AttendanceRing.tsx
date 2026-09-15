import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface AttendanceRingProps {
  presentRate: number;
  size?: number;
  strokeWidth?: number;
}

export default function AttendanceRing({ presentRate, size = 80, strokeWidth = 8 }: AttendanceRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (presentRate / 100) * circumference;

  const getColor = (rate: number) => {
    if (rate >= 90) return Colors.attendancePresent;
    if (rate >= 75) return Colors.attendanceLate;
    return Colors.attendanceAbsent;
  };

  const color = getColor(presentRate);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background ring */}
      <View style={[styles.ring, {
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: Colors.borderLight,
      }]} />
      {/* We simulate the arc with a partial border — for simplicity, show percentage text */}
      <View style={styles.center}>
        <Text style={[styles.percentage, { color }]}>{presentRate}%</Text>
      </View>
      {/* Colored indicator arc at top */}
      <View style={[styles.indicator, {
        width: strokeWidth + 4,
        height: strokeWidth + 4,
        borderRadius: (strokeWidth + 4) / 2,
        backgroundColor: color,
        top: 0,
        left: size / 2 - (strokeWidth + 4) / 2,
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentage: {
    fontSize: 18,
    fontWeight: '700',
  },
  indicator: {
    position: 'absolute',
  },
});
