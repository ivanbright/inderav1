import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { createRotateAnimation, createPulseAnimation } from '../utils/animations';

interface LoadingAnimationProps {
    size?: number;
    color?: string;
    type?: 'spinner' | 'pulse' | 'dots';
}

export default function LoadingAnimation({
    size = 24,
    color = Colors.primary,
    type = 'spinner',
}: LoadingAnimationProps) {
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const dot1Anim = useRef(new Animated.Value(0)).current;
    const dot2Anim = useRef(new Animated.Value(0)).current;
    const dot3Anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (type === 'spinner') {
            const spin = Animated.loop(
                createRotateAnimation(rotateAnim, 1, 1000),
                { iterations: -1 }
            );
            spin.start();
            return () => spin.stop();
        }

        if (type === 'pulse') {
            const pulse = createPulseAnimation(pulseAnim);
            pulse.start();
            return () => pulse.stop();
        }

        if (type === 'dots') {
            const dotAnimation = (anim: Animated.Value, delay: number) =>
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(anim, {
                            toValue: 1,
                            duration: 400,
                            delay,
                            useNativeDriver: true,
                        }),
                        Animated.timing(anim, {
                            toValue: 0.3,
                            duration: 400,
                            useNativeDriver: true,
                        }),
                    ])
                );

            const dots = Animated.parallel([
                dotAnimation(dot1Anim, 0),
                dotAnimation(dot2Anim, 150),
                dotAnimation(dot3Anim, 300),
            ]);
            dots.start();
            return () => dots.stop();
        }
    }, [type, rotateAnim, pulseAnim, dot1Anim, dot2Anim, dot3Anim]);

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    if (type === 'spinner') {
        return (
            <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                <Ionicons name="sync-outline" size={size} color={color} />
            </Animated.View>
        );
    }

    if (type === 'pulse') {
        return (
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <View style={[styles.pulseCircle, { width: size, height: size, backgroundColor: color }]} />
            </Animated.View>
        );
    }

    if (type === 'dots') {
        const dotSize = size / 4;
        return (
            <View style={styles.dotsContainer}>
                <Animated.View style={[
                    styles.dot,
                    {
                        width: dotSize,
                        height: dotSize,
                        backgroundColor: color,
                        opacity: dot1Anim,
                    }
                ]} />
                <Animated.View style={[
                    styles.dot,
                    {
                        width: dotSize,
                        height: dotSize,
                        backgroundColor: color,
                        opacity: dot2Anim,
                    }
                ]} />
                <Animated.View style={[
                    styles.dot,
                    {
                        width: dotSize,
                        height: dotSize,
                        backgroundColor: color,
                        opacity: dot3Anim,
                    }
                ]} />
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    pulseCircle: {
        borderRadius: 50,
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dot: {
        borderRadius: 50,
    },
});