import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { useToast } from '../contexts/ToastContext'; // Use the toast context

// Toast Component
const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // Hide toast after the duration
      setTimeout(onClose, 300); // Wait for animation to complete before calling onClose
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
  };

  const colors = {
    success: 'bg-green-600 border-green-500',
    error: 'bg-red-600 border-red-500',
    warning: 'bg-yellow-600 border-yellow-500',
  };

  const Icon = icons[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className={`fixed top-4 right-4 z-50 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg border flex items-center space-x-3 max-w-md`}
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
          <span className="flex-1">{message}</span>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toast Container
export const ToastContainer = () => {
  const { toasts, removeToast } = useToast(); // Use context to get toasts

  return (
    <div key={toasts.length} className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.length > 0 ? (
        toasts.map((toast) => (
          <Toast
            key={toast.id} // Use unique key for each toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)} // Remove toast after it closes
          />
        ))
      ) : (
        <span>No toasts to display</span> // If no toasts are available
      )}
    </div>
  );
};
