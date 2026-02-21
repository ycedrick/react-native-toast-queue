import React, { createContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';
import { ToastContextType, ToastItem, ToastOptions } from './types';
import { ToastContainer } from './ToastContainer';

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [queue, setQueue] = useState<ToastItem[]>([]);
  const [currentToast, setCurrentToast] = useState<ToastItem | null>(null);
  const toastIdCounter = useRef(0);

  // Queue management
  useEffect(() => {
    if (!currentToast && queue.length > 0) {
      const nextToast = queue[0];
      setCurrentToast(nextToast);
      setQueue((prev) => prev.slice(1));
    }
  }, [currentToast, queue]);

  const show = useCallback((options: ToastOptions) => {
    const id = `toast-${toastIdCounter.current++}`;
    const newItem: ToastItem = { ...options, id };
    setQueue((prev) => [...prev, newItem]);
  }, []);

  const hide = useCallback(() => {
    setCurrentToast(null);
  }, []);

  const clear = useCallback(() => {
    setQueue([]);
    setCurrentToast(null);
  }, []);

  const handleDismiss = useCallback((id: string) => {
    setCurrentToast((current) => {
      // Only dismiss if the id matches the current toast
      if (current?.id === id) {
        return null;
      }
      return current;
    });
  }, []);

  return (
    <ToastContext.Provider value={{ show, hide, clear }}>
      {children}
      <ToastContainer currentToast={currentToast} onDismiss={handleDismiss} />
    </ToastContext.Provider>
  );
};
