import React, { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className = "", label, error, leftIcon, rightIcon, hint, id, ...props },
    ref
  ) => {
    const inputId = id || Math.random().toString(36).substring(7);

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:border-black focus:ring-black/5"
            } ${leftIcon ? "pl-10" : ""} ${
              rightIcon ? "pr-10" : ""
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        {hint && !error && (
          <p className="text-xs text-gray-500 mt-1">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
