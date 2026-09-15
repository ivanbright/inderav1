import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    onBack?: () => void;
    showBack?: boolean;
    rightAction?: React.ReactNode;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onRightPress?: () => void;
    badge?: string | number;
}

export default function ScreenHeader({
    title,
    subtitle,
    onBack,
    showBack = true,
    rightAction,
    rightIcon,
    onRightPress,
    badge,
}: ScreenHeaderProps) {
    const navigation = useNavigation<any>();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <View style={styles.inner}>
                {showBack ? (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleBack}
                        style={styles.backButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        accessibilityLabel="Go back"
                        accessibilityRole="button"
                    >
                        <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.placeholder} />
                )}

                <View style={styles.titleContainer}>
                    <Text style={styles.title} numberOfLines={1}>
                        {title}
                    </Text>
                    {subtitle ? (
                        <Text style={styles.subtitle} numberOfLines={1}>
                            {subtitle}
                        </Text>
                    ) : null}
                </View>

                <View style={styles.rightContainer}>
                    {rightAction ? (
                        rightAction
                    ) : rightIcon ? (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={onRightPress}
                            style={styles.iconButton}
                        >
                            <Ionicons name={rightIcon} size={20} color={Colors.textPrimary} />
                            {badge !== undefined && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{badge}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.placeholder} />
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        paddingTop: Platform.OS === 'ios' ? 52 : 44,
        paddingBottom: 14,
        paddingHorizontal: 20,
        zIndex: 10,
    },
    inner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 44,
    },
    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.8)',
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    title: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.textSecondary,
        marginTop: 2,
        textAlign: 'center',
    },
    rightContainer: {
        width: 42,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    iconButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.8)',
    },
    placeholder: {
        width: 42,
    },
    badge: {
        position: 'absolute',
        top: -3,
        right: -3,
        backgroundColor: Colors.notificationDot,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        borderWidth: 1.5,
        borderColor: Colors.white,
    },
    badgeText: {
        color: Colors.white,
        fontSize: 10,
        fontWeight: '700',
    },
});