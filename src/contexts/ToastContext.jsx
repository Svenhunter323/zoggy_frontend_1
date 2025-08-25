import React, { createContext, useContext, useState, useEffect } from 'react';

const ToastContext = createContext();

// Toast Container Component
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.duration > 0) {
        const timer = setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration);
        return () => clearTimeout(timer);
      }
    });
  }, [toasts, removeToast]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded-lg shadow-lg text-white transition-all duration-300 ${
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-red-500' :
            toast.type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ToastProvider to wrap your application
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now(); // Unique ID for each toast
    const toast = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]); // Add the new toast to the state
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id)); // Remove toast by ID
  };

  return (
    <ToastContext.Provider value={{ showToast, toasts, removeToast, ToastContainer }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Custom hook to use toast functionality
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
