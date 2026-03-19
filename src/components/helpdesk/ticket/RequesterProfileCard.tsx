"use client";

import { Mail, Phone, Building, Hash } from "lucide-react";
import React from "react";
import { useAppSelector } from "@/redux/hooks";

export const RequesterProfileCard: React.FC = () => {
  const user = useAppSelector((state: any) => state.auth.user);

  if (!user) return null;

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-6">
        Requester
      </h3>

      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-lg">
          {initials || "U"}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
            {fullName}
          </h4>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
            <Mail className="w-3.5 h-3.5 mr-1.5" />
            <a href={`mailto:${user.email}`} className="hover:text-primary transition-colors">
              {user.email || "No email"}
            </a>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Hash className="w-4 h-4 mr-2" />
            Employee ID
          </div>
          <span className="font-medium text-gray-900 dark:text-gray-200">{user.id}</span>
        </div>
        
        {user.departmentId && (
          <div className="flex items-center justify-between text-sm pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Building className="w-4 h-4 mr-2" />
              Department
            </div>
            <span className="font-medium text-gray-900 dark:text-gray-200 text-right max-w-[150px] truncate">
              Dept #{user.departmentId}
            </span>
          </div>
        )}

        {user.phoneNumber && (
          <div className="flex items-center justify-between text-sm pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Phone className="w-4 h-4 mr-2" />
              Phone
            </div>
            <span className="font-medium text-gray-900 dark:text-gray-200">{user.phoneNumber}</span>
          </div>
        )}
      </div>
    </div>
  );
};

