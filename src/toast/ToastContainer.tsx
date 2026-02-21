import React, { memo } from 'react';
import { ToastItem } from './types';
import { Toast } from './Toast';

interface ToastContainerProps {
  currentToast: ToastItem | null;
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = memo(({ currentToast, onDismiss }) => {
  if (!currentToast) return null;

  return (
    <Toast
      key={currentToast.id}
      item={currentToast}
      onDismiss={onDismiss}
    />
  );
});
