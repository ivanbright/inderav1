import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import {
    createCardEntranceAnimation,
    createFadeInUp,
    createFadeInDown,
    createBounceInScale,
    ANIMATION_DURATIONS
} from '../utils/animations';

export type AnimationType = 'slideUp' | 'slideDown' | 'fade' | 'bounceIn' | 'scaleIn';

interface AnimatedCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    delay?: number;
    slideDistance?: number;
    duration?: number;
    animationType?: AnimationType;
    onAnimationComplete?: () => void;
}

export default function AnimatedCard({
    children,
    style,
    delay = 0,
    slideDistance = 30,
    duration = ANIMATION_DURATIONS.entrance,
    animationType = 'slideUp',
    onAnimationComplete,
}: AnimatedCardProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(
        animationType === 'slideUp' ? slideDistance :
            animationType === 'slideDown' ? -slideDistance : 0
    )).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        let animation: Animated.CompositeAnimation;

        switch (animationType) {
            case 'slideUp':
                slideAnim.setValue(slideDistance);
                animation = createFadeInUp(fadeAnim, slideAnim, duration, delay);
                break;
            case 'slideDown':
                slideAnim.setValue(-slideDistance);
                animation = createFadeInDown(fadeAnim, slideAnim, duration, delay);
                break;
            case 'fade':
                animation = Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration,
                    delay,
                    useNativeDriver: true,
                });
                break;
            case 'bounceIn':
                animation = createBounceInScale(scaleAnim, 1, duration);
                fadeAnim.setValue(1);
                break;
            case 'scaleIn':
                animation = Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration,
                        delay,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration,
                        delay,
                        useNativeDriver: true,
                    }),
                ]);
                break;
            default:
                animation = createCardEntranceAnimation(fadeAnim, slideAnim, scaleAnim, delay);
        }

        animation.start(onAnimationComplete);
    }, [animationType, delay, duration, slideDistance]);

    const getTransform = () => {
        const transforms: any[] = [];

        if (animationType === 'slideUp' || animationType === 'slideDown') {
            transforms.push({ translateY: slideAnim });
        }

        if (animationType === 'bounceIn' || animationType === 'scaleIn' || animationType === 'slideUp') {
            transforms.push({ scale: scaleAnim });
        }

        return transforms;
    };

    return (
        <Animated.View
            style={[
                style,
                {
                    opacity: fadeAnim,
                    transform: getTransform(),
                },
            ]}
        >
            {children}
        </Animated.View>
    );
}