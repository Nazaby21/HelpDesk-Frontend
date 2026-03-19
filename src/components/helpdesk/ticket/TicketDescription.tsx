import React from "react";

interface TicketDescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

export const TicketDescription: React.FC<TicketDescriptionProps> = ({ value, onChange }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Description
      </h3>
      <textarea
        className="w-full min-h-[150px] p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm leading-relaxed placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
        placeholder="Please describe the issue or what you need."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
