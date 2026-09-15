import React, { useState, useEffect } from 'react';
import { Text, TextStyle } from 'react-native';
import { ANIMATION_DURATIONS } from '../utils/animations';

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    delay?: number;
    style?: TextStyle;
    prefix?: string;
    suffix?: string;
    decimals?: number;
}

export default function AnimatedCounter({
    value,
    duration = ANIMATION_DURATIONS.slow,
    delay = 0,
    style,
    prefix = '',
    suffix = '',
    decimals = 0,
}: AnimatedCounterProps) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const startTime = Date.now() + delay;
        const endTime = startTime + duration;
        const startValue = displayValue;
        const targetValue = value;

        const updateValue = () => {
            const now = Date.now();

            if (now < startTime) {
                requestAnimationFrame(updateValue);
                return;
            }

            if (now >= endTime) {
                setDisplayValue(targetValue);
                return;
            }

            const progress = (now - startTime) / duration;
            const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
            const currentValue = startValue + (targetValue - startValue) * easedProgress;

            setDisplayValue(currentValue);
            requestAnimationFrame(updateValue);
        };

        requestAnimationFrame(updateValue);
    }, [value, duration, delay]);

    return (
        <Text style={style}>
            {prefix}{displayValue.toFixed(decimals)}{suffix}
        </Text>
    );
}