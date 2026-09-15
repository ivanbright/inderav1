import { Animated, Easing } from 'react-native';

// Common animation configurations
export const ANIMATION_DURATIONS = {
    fast: 200,
    medium: 300,
    slow: 500,
    entrance: 400,
    exit: 250,
    veryFast: 150,
    verySlow: 800,
};

export const ANIMATION_EASINGS = {
    easeOut: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    easeIn: Easing.bezier(0.55, 0.055, 0.675, 0.19),
    easeInOut: Easing.bezier(0.645, 0.045, 0.355, 1),
    bounce: Easing.bounce,
    spring: Easing.elastic(1.3),
    smoothBounce: Easing.bezier(0.68, -0.55, 0.265, 1.55),
    materialEaseOut: Easing.bezier(0.0, 0.0, 0.2, 1.0),
    materialEaseIn: Easing.bezier(0.4, 0.0, 1.0, 1.0),
};

// Enhanced fade animations with different variants
export const createFadeAnimation = (
    animatedValue: Animated.Value,
    toValue: number = 1,
    duration: number = ANIMATION_DURATIONS.medium,
    easing = ANIMATION_EASINGS.easeOut
) => {
    return Animated.timing(animatedValue, {
        toValue,
        duration,
        easing,
        useNativeDriver: true,
    });
};

// Fade in from different directions
export const createFadeInUp = (
    fadeValue: Animated.Value,
    translateValue: Animated.Value,
    duration: number = ANIMATION_DURATIONS.entrance,
    delay: number = 0
) => {
    return Animated.parallel([
        Animated.timing(fadeValue, {
            toValue: 1,
            duration,
            delay,
            easing: ANIMATION_EASINGS.materialEaseOut,
            useNativeDriver: true,
        }),
        Animated.timing(translateValue, {
            toValue: 0,
            duration,
            delay,
            easing: ANIMATION_EASINGS.materialEaseOut,
            useNativeDriver: true,
        }),
    ]);
};

export const createFadeInDown = (
    fadeValue: Animated.Value,
    translateValue: Animated.Value,
    duration: number = ANIMATION_DURATIONS.entrance,
    delay: number = 0
) => {
    return Animated.parallel([
        Animated.timing(fadeValue, {
            toValue: 1,
            duration,
            delay,
            easing: ANIMATION_EASINGS.materialEaseOut,
            useNativeDriver: true,
        }),
        Animated.timing(translateValue, {
            toValue: 0,
            duration,
            delay,
            easing: ANIMATION_EASINGS.materialEaseOut,
            useNativeDriver: true,
        }),
    ]);
};

// Scale animations with variants
export const createScaleAnimation = (
    animatedValue: Animated.Value,
    toValue: number = 1,
    duration: number = ANIMATION_DURATIONS.medium,
    easing = ANIMATION_EASINGS.easeOut
) => {
    return Animated.timing(animatedValue, {
        toValue,
        duration,
        easing,
        useNativeDriver: true,
    });
};

export const createBounceInScale = (
    animatedValue: Animated.Value,
    toValue: number = 1,
    duration: number = ANIMATION_DURATIONS.slow
) => {
    return Animated.timing(animatedValue, {
        toValue,
        duration,
        easing: ANIMATION_EASINGS.smoothBounce,
        useNativeDriver: true,
    });
};

// Slide animations
export const createSlideAnimation = (
    animatedValue: Animated.Value,
    toValue: number,
    duration: number = ANIMATION_DURATIONS.medium,
    easing = ANIMATION_EASINGS.easeOut
) => {
    return Animated.timing(animatedValue, {
        toValue,
        duration,
        easing,
        useNativeDriver: true,
    });
};

// Slide with elastic effect
export const createSlideElastic = (
    animatedValue: Animated.Value,
    toValue: number,
    duration: number = ANIMATION_DURATIONS.slow
) => {
    return Animated.timing(animatedValue, {
        toValue,
        duration,
        easing: ANIMATION_EASINGS.spring,
        useNativeDriver: true,
    });
};

// Spring animations
export const createSpringAnimation = (
    animatedValue: Animated.Value,
    toValue: number,
    tension: number = 100,
    friction: number = 8
) => {
    return Animated.spring(animatedValue, {
        toValue,
        tension,
        friction,
        useNativeDriver: true,
    });
};

// Enhanced spring with different configurations
export const createSoftSpring = (
    animatedValue: Animated.Value,
    toValue: number
) => {
    return Animated.spring(animatedValue, {
        toValue,
        tension: 80,
        friction: 12,
        useNativeDriver: true,
    });
};

export const createBouncySpring = (
    animatedValue: Animated.Value,
    toValue: number
) => {
    return Animated.spring(animatedValue, {
        toValue,
        tension: 150,
        friction: 6,
        useNativeDriver: true,
    });
};

// Stagger animation for list items
export const createStaggerAnimation = (
    animations: Animated.CompositeAnimation[],
    stagger: number = 50
) => {
    return Animated.stagger(stagger, animations);
};

// Enhanced button interactions
export const createButtonPressAnimation = (scale: Animated.Value) => {
    return Animated.sequence([
        Animated.timing(scale, {
            toValue: 0.95,
            duration: 100,
            easing: ANIMATION_EASINGS.easeIn,
            useNativeDriver: true,
        }),
        Animated.spring(scale, {
            toValue: 1,
            tension: 300,
            friction: 10,
            useNativeDriver: true,
        }),
    ]);
};

export const createRippleEffect = (
    scaleValue: Animated.Value,
    opacityValue: Animated.Value
) => {
    return Animated.parallel([
        Animated.timing(scaleValue, {
            toValue: 4,
            duration: 600,
            easing: ANIMATION_EASINGS.easeOut,
            useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
            toValue: 0,
            duration: 600,
            easing: ANIMATION_EASINGS.easeOut,
            useNativeDriver: true,
        }),
    ]);
};

// Loading and progress animations
export const createPulseAnimation = (animatedValue: Animated.Value) => {
    return Animated.loop(
        Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: 1.1,
                duration: 800,
                easing: ANIMATION_EASINGS.easeInOut,
                useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 800,
                easing: ANIMATION_EASINGS.easeInOut,
                useNativeDriver: true,
            }),
        ])
    );
};

export const createShimmerAnimation = (animatedValue: Animated.Value) => {
    return Animated.loop(
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
        })
    );
};

export const createProgressAnimation = (
    animatedValue: Animated.Value,
    toValue: number,
    duration: number = 1000
) => {
    return Animated.timing(animatedValue, {
        toValue,
        duration,
        easing: ANIMATION_EASINGS.easeInOut,
        useNativeDriver: false, // Progress animations often need layout changes
    });
};

// Card and list animations
export const createCardEntranceAnimation = (
    fadeValue: Animated.Value,
    slideValue: Animated.Value,
    scaleValue: Animated.Value,
    delay: number = 0
) => {
    return Animated.parallel([
        Animated.timing(fadeValue, {
            toValue: 1,
            duration: ANIMATION_DURATIONS.entrance,
            delay,
            easing: ANIMATION_EASINGS.materialEaseOut,
            useNativeDriver: true,
        }),
        Animated.timing(slideValue, {
            toValue: 0,
            duration: ANIMATION_DURATIONS.entrance,
            delay,
            easing: ANIMATION_EASINGS.materialEaseOut,
            useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: ANIMATION_DURATIONS.entrance,
            delay: delay + 50,
            easing: ANIMATION_EASINGS.smoothBounce,
            useNativeDriver: true,
        }),
    ]);
};

export const createListItemAnimation = (
    fadeValue: Animated.Value,
    translateValue: Animated.Value,
    index: number
) => {
    const delay = index * 50;
    return createFadeInUp(fadeValue, translateValue, ANIMATION_DURATIONS.entrance, delay);
};

// Rotate and flip animations
export const createRotateAnimation = (
    animatedValue: Animated.Value,
    toValue: number = 1,
    duration: number = ANIMATION_DURATIONS.medium
) => {
    return Animated.timing(animatedValue, {
        toValue,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
    });
};

export const createFlipAnimation = (
    animatedValue: Animated.Value,
    duration: number = ANIMATION_DURATIONS.medium
) => {
    return Animated.sequence([
        Animated.timing(animatedValue, {
            toValue: 0.5,
            duration: duration / 2,
            easing: ANIMATION_EASINGS.easeIn,
            useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: duration / 2,
            easing: ANIMATION_EASINGS.easeOut,
            useNativeDriver: true,
        }),
    ]);
};

// Screen transition animations
export const createScreenEntranceAnimation = (
    fadeValue: Animated.Value,
    slideValue: Animated.Value
) => {
    return Animated.parallel([
        createFadeAnimation(fadeValue, 1, ANIMATION_DURATIONS.entrance),
        createSlideAnimation(slideValue, 0, ANIMATION_DURATIONS.entrance, ANIMATION_EASINGS.materialEaseOut),
    ]);
};

export const createScreenExitAnimation = (
    fadeValue: Animated.Value,
    slideValue: Animated.Value
) => {
    return Animated.parallel([
        createFadeAnimation(fadeValue, 0, ANIMATION_DURATIONS.exit),
        createSlideAnimation(slideValue, -50, ANIMATION_DURATIONS.exit, ANIMATION_EASINGS.materialEaseIn),
    ]);
};

// Modal animations
export const createModalEntranceAnimation = (
    fadeValue: Animated.Value,
    scaleValue: Animated.Value
) => {
    return Animated.parallel([
        createFadeAnimation(fadeValue, 1, ANIMATION_DURATIONS.medium),
        createBounceInScale(scaleValue, 1, ANIMATION_DURATIONS.slow),
    ]);
};

export const createModalExitAnimation = (
    fadeValue: Animated.Value,
    scaleValue: Animated.Value
) => {
    return Animated.parallel([
        createFadeAnimation(fadeValue, 0, ANIMATION_DURATIONS.fast),
        createScaleAnimation(scaleValue, 0.8, ANIMATION_DURATIONS.fast),
    ]);
};

// Notification animations
export const createNotificationSlideIn = (
    translateValue: Animated.Value,
    fromTop: boolean = true
) => {
    return createSlideAnimation(
        translateValue,
        0,
        ANIMATION_DURATIONS.medium,
        ANIMATION_EASINGS.smoothBounce
    );
};

export const createNotificationSlideOut = (
    translateValue: Animated.Value,
    toTop: boolean = true
) => {
    return createSlideAnimation(
        translateValue,
        toTop ? -100 : 100,
        ANIMATION_DURATIONS.fast,
        ANIMATION_EASINGS.easeIn
    );
};

// Tab animation
export const createTabSwitchAnimation = (
    fadeOutValue: Animated.Value,
    fadeInValue: Animated.Value,
    slideOutValue: Animated.Value,
    slideInValue: Animated.Value
) => {
    return Animated.sequence([
        Animated.parallel([
            createFadeAnimation(fadeOutValue, 0, ANIMATION_DURATIONS.fast),
            createSlideAnimation(slideOutValue, -20, ANIMATION_DURATIONS.fast),
        ]),
        Animated.parallel([
            createFadeAnimation(fadeInValue, 1, ANIMATION_DURATIONS.medium),
            createSlideAnimation(slideInValue, 0, ANIMATION_DURATIONS.medium),
        ]),
    ]);
};