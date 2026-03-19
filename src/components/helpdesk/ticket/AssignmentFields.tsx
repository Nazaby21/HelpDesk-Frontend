"use client";

import { useRole } from "@/app/role-context";
import { User } from "lucide-react";
import React from "react";

export const AssignmentFields: React.FC = () => {
  const { role } = useRole();
  const isTechOrAdmin = role === "technician" || role === "admin";

  if (!isTechOrAdmin) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Assignment Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Selection (Only for Technician/Admin) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Select User / Requester
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <User className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <select
              className="block w-full rounded-xl border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700 appearance-none bg-white dark:bg-gray-800"
              defaultValue=""
            >
              <option value="" disabled>
                Select a user...
              </option>
              <option value="user1">John Doe</option>
              <option value="user2">Jane Smith</option>
              <option value="user3">Mike Johnson</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

