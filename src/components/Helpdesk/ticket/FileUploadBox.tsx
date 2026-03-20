import { UploadCloud, X } from "lucide-react";
import React, { useRef } from "react";

interface FileUploadBoxProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

export const FileUploadBox: React.FC<FileUploadBoxProps> = ({ file, onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.preventDefault();
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
      <div className="flex justify-center items-center px-6 py-8 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
        {!file ? (
          <div className="space-y-2 text-center">
            <UploadCloud className="mx-auto h-10 w-10 text-gray-400 group-hover:text-primary transition-colors" />
            <div className="flex text-sm text-gray-600 dark:text-gray-400">
              <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                <span>Browse Files</span>
                <input 
                  type="file" 
                  className="sr-only" 
                  accept="image/png, image/jpeg, image/jpg, image/webp" 
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </label>
              <p className="pl-1">or Drag files here</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Supported images: PNG, JPG to 5MB
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full max-w-sm px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 overflow-hidden">
              <UploadCloud className="h-6 w-6 flex-shrink-0 text-primary" />
              <span className="text-sm font-medium truncate text-gray-700 dark:text-gray-300">
                {file.name}
              </span>
            </div>
            <button 
              onClick={clearFile}
              className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
