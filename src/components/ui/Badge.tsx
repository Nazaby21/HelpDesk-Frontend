import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: 
    | "default"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "purple"
    | "outline";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap";

  const variants = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700 border border-red-200",
    info: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    outline: "border border-gray-200 text-gray-700",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
