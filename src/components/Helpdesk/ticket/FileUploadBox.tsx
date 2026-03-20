import { UploadCloud, X } from "lucide-react";
import React, { useRef } from "react";

interface FileUploadBoxProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export const FileUploadBox: React.FC<FileUploadBoxProps> = ({ files, onFilesChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      onFilesChange([...files, ...newFiles]);
    }
    // reset input so the same file could be selected again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (e: React.MouseEvent, indexToRemove: number) => {
    e.preventDefault();
    onFilesChange(files.filter((_, index) => index !== indexToRemove));
  };
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
      <div className="flex flex-col gap-4 px-6 py-8 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-xl transition-colors group">
        
        <div className="space-y-2 text-center">
          <UploadCloud className="mx-auto h-10 w-10 text-gray-400 group-hover:text-primary transition-colors cursor-pointer" />
          <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
            <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
              <span>Browse Files</span>
              <input 
                type="file" 
                className="sr-only" 
                accept="image/png, image/jpeg, image/jpg, image/webp" 
                multiple
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </label>
            <p className="pl-1">or Drag files here</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Supported images: PNG, JPG to 5MB (Multiple uploads allowed)
          </p>
        </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-2 w-full max-w-md mx-auto">
            {files.map((selectedFile, index) => (
              <div key={index} className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <UploadCloud className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm font-medium truncate text-gray-700 dark:text-gray-300">
                    {selectedFile.name}
                  </span>
                </div>
                <button 
                  onClick={(e) => removeFile(e, index)}
                  className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
