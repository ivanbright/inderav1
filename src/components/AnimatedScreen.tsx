import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import {
    createScreenEntranceAnimation,
    createFadeAnimation,
    createSlideAnimation,
    ANIMATION_DURATIONS,
} from '../utils/animations';

interface AnimatedScreenProps {
    children: React.ReactNode;
    style?: ViewStyle;
    backgroundColor?: string;
    animationType?: 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale';
    duration?: number;
    delay?: number;
    useSafeArea?: boolean;
}

export default function AnimatedScreen({
    children,
    style,
    backgroundColor = Colors.background,
    animationType = 'slideUp',
    duration = ANIMATION_DURATIONS.entrance,
    delay = 0,
    useSafeArea = true,
}: AnimatedScreenProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateAnim = useRef(new Animated.Value(getInitialTranslateValue(animationType))).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    function getInitialTranslateValue(type: string) {
        switch (type) {
            case 'slideUp': return 50;
            case 'slideDown': return -50;
            case 'slideLeft': return 50;
            case 'slideRight': return -50;
            default: return 0;
        }
    }

    useEffect(() => {
        let animation: Animated.CompositeAnimation;

        switch (animationType) {
            case 'fade':
                animation = createFadeAnimation(fadeAnim, 1, duration);
                translateAnim.setValue(0);
                scaleAnim.setValue(1);
                break;
            case 'scale':
                animation = Animated.parallel([
                    createFadeAnimation(fadeAnim, 1, duration),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration,
                        delay,
                        useNativeDriver: true,
                    }),
                ]);
                translateAnim.setValue(0);
                break;
            case 'slideLeft':
            case 'slideRight':
                animation = Animated.parallel([
                    createFadeAnimation(fadeAnim, 1, duration),
                    createSlideAnimation(translateAnim, 0, duration),
                ]);
                scaleAnim.setValue(1);
                break;
            case 'slideUp':
            case 'slideDown':
            default:
                animation = createScreenEntranceAnimation(fadeAnim, translateAnim);
                scaleAnim.setValue(1);
                break;
        }

        animation.start();
    }, [animationType, duration, delay]);

    const getTransform = () => {
        const transforms: any[] = [];

        if (animationType.includes('slide')) {
            if (animationType === 'slideLeft' || animationType === 'slideRight') {
                transforms.push({ translateX: translateAnim });
            } else {
                transforms.push({ translateY: translateAnim });
            }
        }

        if (animationType === 'scale') {
            transforms.push({ scale: scaleAnim });
        }

        return transforms;
    };

    const animatedStyle = {
        opacity: fadeAnim,
        transform: getTransform(),
    };

    const Container = useSafeArea ? SafeAreaView : View;

    return (
        <Container style={[{ flex: 1, backgroundColor }, style]}>
            <Animated.View style={[{ flex: 1 }, animatedStyle]}>
                {children}
            </Animated.View>
        </Container>
    );
}