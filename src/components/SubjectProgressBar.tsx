import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../theme/colors';
import { createFadeAnimation, ANIMATION_DURATIONS } from '../utils/animations';

interface SubjectProgressBarProps {
  subject: string;
  percentage: number;
  color: string;
  teacher?: string;
  delay?: number;
}

export default function SubjectProgressBar({
  subject,
  percentage,
  color,
  teacher,
  delay = 0
}: SubjectProgressBarProps) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const progressAnimation = Animated.timing(progressAnim, {
      toValue: percentage,
      duration: ANIMATION_DURATIONS.slow + delay,
      delay,
      useNativeDriver: false,
    });

    const fadeAnimation = createFadeAnimation(fadeAnim, 1, ANIMATION_DURATIONS.medium, delay);

    Animated.parallel([progressAnimation, fadeAnimation]).start();
  }, [percentage, delay]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <View style={[styles.dot, { backgroundColor: color }]} />
          <Text style={styles.subject}>{subject}</Text>
        </View>
        <Animated.Text style={[styles.percentage, { color }]}>
          {Math.round(percentage)}%
        </Animated.Text>
      </View>
      {teacher && <Text style={styles.teacher}>{teacher}</Text>}
      <View style={styles.trackOuter}>
        <Animated.View
          style={[
            styles.trackInner,
            {
              backgroundColor: color,
              transform: [{ scaleX: progressWidth }]
            }
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  subject: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  teacher: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginLeft: 16,
    marginBottom: 6,
  },
  percentage: {
    fontSize: 15,
    fontWeight: '700',
  },
  trackOuter: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.borderLight,
    overflow: 'hidden',
  },
  trackInner: {
    height: 6,
    borderRadius: 3,
    width: '100%',
    transformOrigin: 'left',
  },
});
