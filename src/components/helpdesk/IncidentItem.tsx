import { Incident } from "@/data/incidents";
import { Ticket } from "lucide-react";
import React from "react";
import Link from "next/link";

interface IncidentItemProps {
  incident: Incident;
}

export const IncidentItem: React.FC<IncidentItemProps> = ({ incident }) => {
  return (
    <Link href={`/incident-catalog/${incident.id}`} className="block">
      <div
        className={`group flex items-start gap-4 p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer border
          ${
            incident.highlighted
              ? "border-orange-500"
              : "border-gray-100 dark:border-gray-800"
          }
        `}
      >
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg 
            ${
              incident.highlighted
                ? "bg-orange-50 text-orange-500"
                : "bg-primary/10 text-primary"
            }
          `}
        >
          <Ticket className="h-6 w-6" />
        </div>

        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary transition-colors dark:text-white">
            {incident.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {incident.category}
          </p>
        </div>
      </div>
    </Link>
  );
};
