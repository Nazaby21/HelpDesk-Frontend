import { ArrowLeft, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";

interface TicketHeaderProps {
  id: string;
  title: string;
  creatorName: string;
  createdDate: string;
  dueDate: string;
  assignedTeam: string;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export const TicketHeader: React.FC<TicketHeaderProps> = ({
  id,
  title,
  creatorName,
  createdDate,
  assignedTeam,
  onSubmit,
  isSubmitting = false,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-5">
        <Link
          href="/incident-catalog"
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? "Submitting…" : "Submit Ticket"}
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {id ? `#${id} ` : "New Ticket: "}{title}
      </h1>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">Created by:</span>
          {creatorName}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">Created Date:</span>
          {createdDate}
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-medium border border-blue-100 dark:border-blue-800">
            {assignedTeam}
          </span>
        </div>
      </div>
    </div>
  );
};

