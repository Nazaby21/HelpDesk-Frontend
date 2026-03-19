import { ChevronRight } from "lucide-react";
import React from "react";

export const TicketSidebar: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Status
          </h4>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-200">Open</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Priority
          </h4>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-200">High</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Due Date
          </h4>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 italic">
            Pending Assignment
          </div>
        </div>
      </div>
    </div>
  );
};
