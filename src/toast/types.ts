import { ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type ToastPosition = 'top' | 'bottom';

export interface ToastOptions {
  /**
   * The message to display in the toast.
   */
  message: string;
  /**
   * The type of toast, which affects the styling.
   * Default: 'info'
   */
  type?: ToastType;
  /**
   * Duration in milliseconds before the toast auto-dismisses.
   * Default: 3000ms
   */
  duration?: number;
  /**
   * Whether to trigger haptic feedback when the toast appears.
   * Default: false
   */
  haptic?: boolean;
  /**
   * Position of the toast on the screen.
   * Default: 'top'
   */
  position?: ToastPosition;
  /**
   * Custom styles for the toast container.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Custom styles for the toast text.
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * Whether to show a progress bar indicating remaining time.
   * Default: false
   */
  showProgress?: boolean;
  /**
   * Custom icon or component to render.
   */
  icon?: ReactNode;
  /**
   * Callback fired when the toast is pressed.
   */
  onPress?: () => void;
}

export interface ToastItem extends ToastOptions {
  id: string;
}

export interface ToastContextType {
  /**
   * Show a toast message.
   */
  show: (options: ToastOptions) => void;
  /**
   * Hide the current toast immediately.
   */
  hide: () => void;
  /**
   * Clear all toasts in the queue.
   */
  clear: () => void;
}
