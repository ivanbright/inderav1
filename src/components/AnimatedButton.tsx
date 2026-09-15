import React, { useRef, useState } from 'react';
import {
    TouchableOpacity,
    Animated,
    StyleSheet,
    TouchableOpacityProps,
    ViewStyle,
    TextStyle,
    View,
} from 'react-native';
import { createButtonPressAnimation, createRippleEffect, ANIMATION_EASINGS } from '../utils/animations';

interface AnimatedButtonProps extends TouchableOpacityProps {
    children: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
    scaleValue?: number;
    onPress?: () => void;
    rippleEffect?: boolean;
    rippleColor?: string;
    hapticFeedback?: boolean;
    bounceEffect?: boolean;
}

export default function AnimatedButton({
    children,
    style,
    textStyle,
    scaleValue = 0.95,
    onPress,
    rippleEffect = false,
    rippleColor = 'rgba(255, 255, 255, 0.3)',
    hapticFeedback = false,
    bounceEffect = true,
    ...props
}: AnimatedButtonProps) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rippleScale = useRef(new Animated.Value(0)).current;
    const rippleOpacity = useRef(new Animated.Value(1)).current;
    const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

    const handlePressIn = () => {
        if (bounceEffect) {
            Animated.timing(scaleAnim, {
                toValue: scaleValue,
                duration: 100,
                easing: ANIMATION_EASINGS.easeIn,
                useNativeDriver: true,
            }).start();
        }
    };

    const handlePressOut = () => {
        if (bounceEffect) {
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 300,
                friction: 10,
                useNativeDriver: true,
            }).start();
        }
    };

    const handlePress = (event?: any) => {
        if (bounceEffect) {
            createButtonPressAnimation(scaleAnim).start();
        }

        if (rippleEffect && event) {
            const { locationX, locationY } = event.nativeEvent;
            const newRipple = {
                id: Date.now(),
                x: locationX,
                y: locationY,
            };

            setRipples(prev => [...prev, newRipple]);

            // Reset ripple animation values
            rippleScale.setValue(0);
            rippleOpacity.setValue(1);

            // Start ripple animation
            createRippleEffect(rippleScale, rippleOpacity).start(() => {
                setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
            });
        }

        onPress?.();
    };

    return (
        <TouchableOpacity
            {...props}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            activeOpacity={rippleEffect ? 1 : 0.8}
            style={{ overflow: 'hidden' }}
        >
            <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
                {typeof children === 'string' ? (
                    <Animated.Text style={textStyle}>{children}</Animated.Text>
                ) : (
                    children
                )}

                {/* Ripple Effect */}
                {rippleEffect && ripples.map(ripple => (
                    <Animated.View
                        key={ripple.id}
                        style={[
                            StyleSheet.absoluteFillObject,
                            {
                                backgroundColor: rippleColor,
                                borderRadius: 1000,
                                transform: [
                                    { translateX: ripple.x - 50 },
                                    { translateY: ripple.y - 50 },
                                    { scale: rippleScale },
                                ],
                                opacity: rippleOpacity,
                                width: 100,
                                height: 100,
                            },
                        ]}
                    />
                ))}
            </Animated.View>
        </TouchableOpacity>
    );
}