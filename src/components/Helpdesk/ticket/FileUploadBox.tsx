import { UploadCloud } from "lucide-react";
import React from "react";

export const FileUploadBox: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
      <div className="flex justify-center items-center px-6 py-8 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
        <div className="space-y-2 text-center">
          <UploadCloud className="mx-auto h-10 w-10 text-gray-400 group-hover:text-primary transition-colors" />
          <div className="flex text-sm text-gray-600 dark:text-gray-400">
            <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
              <span>Browse Files</span>
              <input type="file" className="sr-only" multiple />
            </label>
            <p className="pl-1">or Drag files here</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Max size: 10 MB
          </p>
        </div>
      </div>
    </div>
  );
};
