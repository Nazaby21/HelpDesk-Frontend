import { Incident } from "@/data/incidents";
import React from "react";
import { IncidentItem } from "./IncidentItem";
import { ArrowLeft } from "lucide-react";

interface IncidentListProps {
  incidents: Incident[];
  categoryName: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const IncidentList: React.FC<IncidentListProps> = ({
  incidents,
  categoryName,
  showBackButton,
  onBack,
}) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800">
        {showBackButton && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </button>
        )}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {categoryName}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Select a template to report an issue or request what you need.
        </p>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {incidents.map((incident) => (
            <IncidentItem key={incident.id} incident={incident} />
          ))}
          {incidents.length === 0 && (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              No incident templates found for this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
