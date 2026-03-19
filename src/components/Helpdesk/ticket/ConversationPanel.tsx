import { ArrowUpDown, MessageSquarePlus } from "lucide-react";
import React from "react";

export const ConversationPanel: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Conversations
        </h3>
        <div className="flex items-center gap-3">
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            <MessageSquarePlus className="w-4 h-4 mr-2" />
            Add Notes
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-gray-700">
          <MessageSquarePlus className="w-8 h-8 text-gray-400" />
        </div>
        <h4 className="text-base font-medium text-gray-900 dark:text-gray-200 mb-1">
          No Conversations
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          There are no replies or notes on this ticket yet. Click &quot;Add Notes&quot; to start the conversation.
        </p>
      </div>
    </div>
  );
};
