import React, { useEffect, useState } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function Toast({
  message,
  type = "success",
  isOpen,
  onClose,
  duration = 4000,
  action,
  secondaryAction,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-green-400" />,
    error: <AlertCircle className="h-5 w-5 text-red-400" />,
    info: <Info className="h-5 w-5 text-blue-400" />,
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-4 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-lg transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="flex items-center gap-3">
        {icons[type]}
        <span>{message}</span>
      </div>

      {(action || secondaryAction) && (
        <div className="ml-4 flex items-center gap-3 border-l border-gray-700 pl-4">
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="font-medium text-gray-300 transition-colors hover:text-white hover:underline underline-offset-2"
            >
              {secondaryAction.label}
            </button>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="font-medium text-white transition-colors hover:underline underline-offset-2"
            >
              {action.label}
            </button>
          )}
        </div>
      )}

      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
