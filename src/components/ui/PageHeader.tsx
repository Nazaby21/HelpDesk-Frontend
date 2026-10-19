import React, { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, action, children }: PageHeaderProps) {
  return (
    <div className="mb-6 pb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-gray-100 dark:border-gray-800">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </div>
      {(action || children) && (
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          {children}
          {action}
        </div>
      )}
    </div>
  );
}
