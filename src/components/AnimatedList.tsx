import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';
import { createListItemAnimation, ANIMATION_DURATIONS } from '../utils/animations';

interface AnimatedListProps {
    children: React.ReactNode[];
    style?: ViewStyle;
    itemStyle?: ViewStyle;
    staggerDelay?: number;
    animationDuration?: number;
    slideDistance?: number;
}

export default function AnimatedList({
    children,
    style,
    itemStyle,
    staggerDelay = 50,
    animationDuration = ANIMATION_DURATIONS.entrance,
    slideDistance = 30,
}: AnimatedListProps) {
    const animatedValues = useRef(
        children.map(() => ({
            fade: new Animated.Value(0),
            translate: new Animated.Value(slideDistance),
        }))
    ).current;

    useEffect(() => {
        const animations = animatedValues.map((values, index) =>
            createListItemAnimation(values.fade, values.translate, index)
        );

        // Start all animations with stagger
        Animated.stagger(staggerDelay, animations).start();
    }, [children.length]);

    return (
        <View style={style}>
            {children.map((child, index) => {
                const animValue = animatedValues[index];
                if (!animValue) return child;

                return (
                    <Animated.View
                        key={index}
                        style={[
                            itemStyle,
                            {
                                opacity: animValue.fade,
                                transform: [{ translateY: animValue.translate }],
                            },
                        ]}
                    >
                        {child}
                    </Animated.View>
                );
            })}
        </View>
    );
}