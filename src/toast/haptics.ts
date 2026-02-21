import { ToastType } from './types';

let Haptics: any;

try {
  Haptics = require('expo-haptics');
} catch (error) {
  Haptics = null;
}

/**
 * Triggers haptic feedback based on the toast type if available.
 */
export const triggerHaptic = (type: ToastType) => {
  if (!Haptics) return;

  switch (type) {
    case 'success':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      break;
    case 'error':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      break;
    case 'warning':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      break;
    case 'info':
    default:
      Haptics.selectionAsync(); // Lighter feedback for info
      break;
  }
};
