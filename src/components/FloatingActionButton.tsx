import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import AnimatedButton from './AnimatedButton';
import { createSpringAnimation, createPulseAnimation } from '../utils/animations';

interface FloatingActionButtonProps {
    iconName: any;
    onPress: () => void;
    size?: number;
    backgroundColor?: string;
    iconColor?: string;
    pulse?: boolean;
}

export default function FloatingActionButton({
    iconName,
    onPress,
    size = 56,
    backgroundColor = Colors.primary,
    iconColor = Colors.white,
    pulse = false,
}: FloatingActionButtonProps) {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Entrance animation
        const entranceAnimation = createSpringAnimation(scaleAnim, 1, 150, 10);
        entranceAnimation.start();

        // Pulse animation if enabled
        if (pulse) {
            const pulseAnimation = createPulseAnimation(pulseAnim);
            pulseAnimation.start();
            return () => pulseAnimation.stop();
        }
    }, [pulse]);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor,
                    transform: [{ scale: scaleAnim }],
                },
            ]}
        >
            <Animated.View style={{ transform: [{ scale: pulse ? pulseAnim : 1 }] }}>
                <AnimatedButton
                    style={[styles.button, { width: size, height: size, borderRadius: size / 2 }]}
                    onPress={onPress}
                >
                    <Ionicons name={iconName} size={size * 0.4} color={iconColor} />
                </AnimatedButton>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});