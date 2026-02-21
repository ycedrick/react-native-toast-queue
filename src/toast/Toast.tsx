import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Easing,
} from 'react-native';
import { ToastItem, ToastType } from './types';
import { triggerHaptic } from './haptics';

interface ToastProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

const COLORS: Record<ToastType, string> = {
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
};

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'ℹ',
};

export const Toast: React.FC<ToastProps> = ({ item, onDismiss }) => {
  const {
    id,
    message,
    type = 'info',
    duration = 3000,
    haptic,
    position = 'top',
    style,
    textStyle,
    showProgress,
    icon,
    onPress,
  } = item;

  const [isVisible, setIsVisible] = useState(false);
  
  // Animations
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(position === 'top' ? -50 : 50)).current;
  const progress = useRef(new Animated.Value(1)).current;

  const isDismissed = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // Trigger haptics on mount
    if (haptic) {
      triggerHaptic(type);
    }

    setIsVisible(true);

    // Entrance Animation
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 5,
      }),
    ]).start();

    // Progress Bar Animation
    if (showProgress) {
      Animated.timing(progress, {
        toValue: 0,
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: false, 
      }).start();
    }

    // Auto-dismiss timer
    timerRef.current = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleDismiss = () => {
    if (isDismissed.current) return;
    isDismissed.current = true;
    
    if (timerRef.current) clearTimeout(timerRef.current);

    setIsVisible(false);

    // Exit Animation
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: position === 'top' ? -50 : 50,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(id);
    });
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    handleDismiss();
  };

  const backgroundColor = COLORS[type];
  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const positionStyle = position === 'top' ? { top: Platform.OS === 'ios' ? 50 : 20 } : { bottom: Platform.OS === 'ios' ? 50 : 20 };

  return (
    <Animated.View
      style={[
        styles.container,
        positionStyle,
        { opacity, transform: [{ translateY }] },
        style,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={[styles.content, { backgroundColor }]}
      >
        <View style={styles.row}>
          <View style={styles.iconContainer}>
             {icon ? icon : <Text style={styles.iconText}>{ICONS[type]}</Text>}
          </View>
          <Text style={[styles.message, textStyle]}>{message}</Text>
        </View>

        {showProgress && (
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressWidth,
                  backgroundColor: 'rgba(255,255,255,0.4)',
                },
              ]}
            />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  progressBarContainer: {
    height: 4,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  progressBar: {
    height: '100%',
  },
});
