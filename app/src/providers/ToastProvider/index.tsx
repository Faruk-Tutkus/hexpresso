import { Toast } from '@components';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

type ToastState = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  duration?: number;
  showProgress?: boolean;
};

type ToastContextType = {
  showToast: (
    message: string, 
    type: 'success' | 'error' | 'info' | 'warning',
    options?: {
      title?: string;
      duration?: number;
      showProgress?: boolean;
    }
  ) => void;
  hideToast: (id?: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const isMountedRef = useRef(true);

  const showToast = (
    message: string, 
    type: 'success' | 'error' | 'info' | 'warning',
    options?: {
      title?: string;
      duration?: number;
      showProgress?: boolean;
    }
  ) => {
    if (!isMountedRef.current) {
      console.log('🚫 ToastProvider: Component unmounted, skipping toast');
      return;
    }
    const id = Math.random().toString(36).substr(2, 9);
    const toast: ToastState = {
      id,
      message,
      type,
      title: options?.title,
      duration: options?.duration || 4000,
      showProgress: options?.showProgress !== false
    };
    setToasts(prev => [toast, ...prev]);
  };

  const hideToast = (id?: string) => {
    if (id) {
      setToasts(prev => prev.filter(t => t.id !== id));
    } else {
      setToasts([]);
    }
  };

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {/* Toasts container at the top, stacking vertically */}
      {toasts.length > 0 && (
        <View style={{ position: 'absolute', top: 60, left: 0, right: 0, zIndex: 9999, pointerEvents: 'box-none' }} pointerEvents="box-none">
          {toasts.map((toast, idx) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              title={toast.title}
              duration={toast.duration}
              showProgress={toast.showProgress}
              onClose={() => hideToast(toast.id)}
              index={idx}
              total={toasts.length}
            />
          ))}
        </View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
