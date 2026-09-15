import React, { useEffect, useRef } from 'react';
import {
    Modal,
    View,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    StatusBar,
} from 'react-native';
import { Colors } from '../theme/colors';
import {
    createModalEntranceAnimation,
    createModalExitAnimation,
    createFadeAnimation,
    ANIMATION_DURATIONS,
} from '../utils/animations';

const { width, height } = Dimensions.get('window');

interface AnimatedModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    animationType?: 'slide' | 'fade' | 'scale';
    backdropOpacity?: number;
    dismissOnBackdrop?: boolean;
}

export default function AnimatedModal({
    visible,
    onClose,
    children,
    animationType = 'scale',
    backdropOpacity = 0.5,
    dismissOnBackdrop = true,
}: AnimatedModalProps) {
    const backdropFadeAnim = useRef(new Animated.Value(0)).current;
    const modalFadeAnim = useRef(new Animated.Value(0)).current;
    const modalScaleAnim = useRef(new Animated.Value(0.8)).current;
    const modalSlideAnim = useRef(new Animated.Value(height)).current;

    useEffect(() => {
        if (visible) {
            showModal();
        } else {
            hideModal();
        }
    }, [visible]);

    const showModal = () => {
        // Reset values
        backdropFadeAnim.setValue(0);
        modalFadeAnim.setValue(0);
        modalScaleAnim.setValue(0.8);
        modalSlideAnim.setValue(height);

        // Show backdrop
        createFadeAnimation(backdropFadeAnim, backdropOpacity, ANIMATION_DURATIONS.medium).start();

        // Show modal based on animation type
        let modalAnimation;
        switch (animationType) {
            case 'slide':
                modalAnimation = Animated.parallel([
                    createFadeAnimation(modalFadeAnim, 1, ANIMATION_DURATIONS.medium),
                    Animated.spring(modalSlideAnim, {
                        toValue: 0,
                        tension: 100,
                        friction: 8,
                        useNativeDriver: true,
                    }),
                ]);
                break;
            case 'fade':
                modalAnimation = createFadeAnimation(modalFadeAnim, 1, ANIMATION_DURATIONS.medium);
                modalScaleAnim.setValue(1);
                break;
            case 'scale':
            default:
                modalAnimation = createModalEntranceAnimation(modalFadeAnim, modalScaleAnim);
                break;
        }

        modalAnimation.start();
    };

    const hideModal = () => {
        let modalAnimation;
        switch (animationType) {
            case 'slide':
                modalAnimation = Animated.parallel([
                    createFadeAnimation(modalFadeAnim, 0, ANIMATION_DURATIONS.fast),
                    Animated.timing(modalSlideAnim, {
                        toValue: height,
                        duration: ANIMATION_DURATIONS.fast,
                        useNativeDriver: true,
                    }),
                ]);
                break;
            case 'fade':
                modalAnimation = createFadeAnimation(modalFadeAnim, 0, ANIMATION_DURATIONS.fast);
                break;
            case 'scale':
            default:
                modalAnimation = createModalExitAnimation(modalFadeAnim, modalScaleAnim);
                break;
        }

        // Hide backdrop and modal
        Animated.parallel([
            createFadeAnimation(backdropFadeAnim, 0, ANIMATION_DURATIONS.fast),
            modalAnimation,
        ]).start();
    };

    const handleBackdropPress = () => {
        if (dismissOnBackdrop) {
            onClose();
        }
    };

    const getModalTransform = () => {
        switch (animationType) {
            case 'slide':
                return [{ translateY: modalSlideAnim }];
            case 'fade':
                return [];
            case 'scale':
            default:
                return [{ scale: modalScaleAnim }];
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            statusBarTranslucent={true}
        >
            <View style={styles.container}>
                <StatusBar backgroundColor="transparent" translucent />

                {/* Backdrop */}
                <Animated.View
                    style={[
                        styles.backdrop,
                        {
                            opacity: backdropFadeAnim,
                        },
                    ]}
                >
                    <TouchableOpacity
                        style={StyleSheet.absoluteFillObject}
                        onPress={handleBackdropPress}
                        activeOpacity={1}
                    />
                </Animated.View>

                {/* Modal Content */}
                <View style={styles.modalContainer}>
                    <Animated.View
                        style={[
                            styles.modal,
                            {
                                opacity: modalFadeAnim,
                                transform: getModalTransform(),
                            },
                        ]}
                    >
                        {children}
                    </Animated.View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.shadow,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modal: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 20,
    },
});