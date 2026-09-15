import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import {
    createNotificationSlideIn,
    createNotificationSlideOut,
    createFadeAnimation,
    createScaleAnimation,
    ANIMATION_DURATIONS,
} from '../utils/animations';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface AnimatedNotificationProps {
    type: NotificationType;
    title: string;
    message?: string;
    visible: boolean;
    onDismiss?: () => void;
    autoHide?: boolean;
    duration?: number;
    position?: 'top' | 'bottom';
}

export default function AnimatedNotification({
    type,
    title,
    message,
    visible,
    onDismiss,
    autoHide = true,
    duration = 3000,
    position = 'top',
}: AnimatedNotificationProps) {
    const translateAnim = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        if (visible) {
            // Show notification
            const showAnimation = Animated.parallel([
                createNotificationSlideIn(translateAnim, position === 'top'),
                createFadeAnimation(fadeAnim, 1, ANIMATION_DURATIONS.medium),
                createScaleAnimation(scaleAnim, 1, ANIMATION_DURATIONS.medium),
            ]);

            showAnimation.start();

            // Auto hide
            if (autoHide) {
                setTimeout(() => {
                    hideNotification();
                }, duration);
            }
        } else {
            hideNotification();
        }
    }, [visible]);

    const hideNotification = () => {
        const hideAnimation = Animated.parallel([
            createNotificationSlideOut(translateAnim, position === 'top'),
            createFadeAnimation(fadeAnim, 0, ANIMATION_DURATIONS.fast),
            createScaleAnimation(scaleAnim, 0.8, ANIMATION_DURATIONS.fast),
        ]);

        hideAnimation.start(() => {
            onDismiss?.();
        });
    };

    const getNotificationConfig = () => {
        switch (type) {
            case 'success':
                return {
                    backgroundColor: Colors.attendancePresent,
                    icon: 'checkmark-circle',
                    textColor: Colors.white,
                };
            case 'error':
                return {
                    backgroundColor: Colors.attendanceAbsent,
                    icon: 'close-circle',
                    textColor: Colors.white,
                };
            case 'warning':
                return {
                    backgroundColor: Colors.attendanceLate,
                    icon: 'warning',
                    textColor: Colors.white,
                };
            case 'info':
                return {
                    backgroundColor: Colors.primary,
                    icon: 'information-circle',
                    textColor: Colors.white,
                };
            default:
                return {
                    backgroundColor: Colors.primary,
                    icon: 'information-circle',
                    textColor: Colors.white,
                };
        }
    };

    const config = getNotificationConfig();

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    [position]: 50,
                    backgroundColor: config.backgroundColor,
                    opacity: fadeAnim,
                    transform: [
                        { translateY: translateAnim },
                        { scale: scaleAnim },
                    ],
                },
            ]}
        >
            <View style={styles.content}>
                <Ionicons
                    name={config.icon as any}
                    size={24}
                    color={config.textColor}
                    style={styles.icon}
                />
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: config.textColor }]}>
                        {title}
                    </Text>
                    {message && (
                        <Text style={[styles.message, { color: config.textColor }]}>
                            {message}
                        </Text>
                    )}
                </View>
                {onDismiss && (
                    <TouchableOpacity onPress={hideNotification} style={styles.closeButton}>
                        <Ionicons name="close" size={20} color={config.textColor} />
                    </TouchableOpacity>
                )}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 16,
        right: 16,
        borderRadius: 12,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 1000,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    icon: {
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    message: {
        fontSize: 14,
        opacity: 0.9,
    },
    closeButton: {
        padding: 4,
        marginLeft: 8,
    },
});