import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import { Colors } from '../theme/colors';
import {
    createFadeAnimation,
    createProgressAnimation,
    createPulseAnimation,
    createShimmerAnimation,
    ANIMATION_DURATIONS,
    ANIMATION_EASINGS
} from '../utils/animations';

interface AnimatedProgressBarProps {
    progress: number; // 0 to 100
    height?: number;
    backgroundColor?: string;
    progressColor?: string;
    showPercentage?: boolean;
    animationDuration?: number;
    delay?: number;
    showPulse?: boolean;
    showShimmer?: boolean;
    gradientColors?: string[];
}

export default function AnimatedProgressBar({
    progress,
    height = 8,
    backgroundColor = Colors.background,
    progressColor = Colors.primary,
    showPercentage = false,
    animationDuration = ANIMATION_DURATIONS.slow,
    delay = 0,
    showPulse = false,
    showShimmer = false,
    gradientColors,
}: AnimatedProgressBarProps) {
    const progressAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const shimmerAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        // Start entrance animation
        const entranceAnimation = Animated.parallel([
            createFadeAnimation(fadeAnim, 1, ANIMATION_DURATIONS.medium),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: ANIMATION_DURATIONS.medium,
                delay,
                easing: ANIMATION_EASINGS.smoothBounce,
                useNativeDriver: true,
            }),
        ]);

        entranceAnimation.start(() => {
            // Start progress animation after entrance
            createProgressAnimation(progressAnim, progress, animationDuration).start();
        });
    }, []);

    useEffect(() => {
        // Update progress when prop changes
        createProgressAnimation(progressAnim, progress, animationDuration).start();
    }, [progress]);

    useEffect(() => {
        // Start pulse animation if enabled
        if (showPulse) {
            createPulseAnimation(pulseAnim).start();
        }
    }, [showPulse]);

    useEffect(() => {
        // Start shimmer animation if enabled
        if (showShimmer) {
            createShimmerAnimation(shimmerAnim).start();
        }
    }, [showShimmer]);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp',
    });

    const shimmerTranslate = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 200],
        extrapolate: 'clamp',
    });

    const animatedPercentage = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 100],
        extrapolate: 'clamp',
    });

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                }
            ]}
        >
            <View style={[styles.track, { height, backgroundColor }]}>
                <Animated.View
                    style={[
                        styles.progress,
                        {
                            width: progressWidth,
                            height,
                            backgroundColor: progressColor,
                            transform: showPulse ? [{ scale: pulseAnim }] : undefined,
                        },
                    ]}
                >
                    {/* Shimmer Effect */}
                    {showShimmer && (
                        <Animated.View
                            style={[
                                styles.shimmer,
                                {
                                    transform: [{ translateX: shimmerTranslate }],
                                },
                            ]}
                        />
                    )}
                </Animated.View>
            </View>
            {showPercentage && (
                <View style={styles.percentageContainer}>
                    <Animated.Text style={[styles.percentage, { opacity: fadeAnim }]}>
                        <Animated.Text>
                            {/* Use a listener to update percentage text */}
                            {Math.round(progress)}%
                        </Animated.Text>
                    </Animated.Text>
                </View>
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    track: {
        borderRadius: 50,
        overflow: 'hidden',
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    progress: {
        borderRadius: 50,
        overflow: 'hidden',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    shimmer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 50,
    },
    percentageContainer: {
        marginTop: 8,
        alignItems: 'flex-end',
    },
    percentage: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
});