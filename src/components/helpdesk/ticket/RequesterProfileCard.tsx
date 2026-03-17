import { Mail, Phone, Building, Briefcase, Hash, User } from "lucide-react";
import React from "react";

export const RequesterProfileCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-6">
        Requester
      </h3>

      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-lg">
          MN
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
            Measrithy Nazaby
          </h4>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
            <Mail className="w-3.5 h-3.5 mr-1.5" />
            <a href="mailto:nazaby@gmail.com" className="hover:text-primary transition-colors">
              nazaby@gmail.com
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
          <span className="font-medium text-gray-900 dark:text-gray-200">601583</span>
        </div>
        
        <div className="flex items-center justify-between text-sm pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Building className="w-4 h-4 mr-2" />
            Department
          </div>
          <span className="font-medium text-gray-900 dark:text-gray-200 text-right max-w-[150px] truncate">
            Branch Supervision, PHPH
          </span>
        </div>

        <div className="flex items-center justify-between text-sm pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Phone className="w-4 h-4 mr-2" />
            Phone
          </div>
          <span className="font-medium text-gray-900 dark:text-gray-200">087 711 220</span>
        </div>
      </div>
    </div>
  );
};
