import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  totalResults?: number;
  resultsPerPage?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  totalResults,
  resultsPerPage,
}: PaginationProps) {
  let pages: (number | string)[] = [];
  if (totalPages <= 7) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (currentPage <= 4) {
      pages = [1, 2, 3, 4, 5, '...', totalPages];
    } else if (currentPage >= totalPages - 3) {
      pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6 mt-6 ${className}`}>
      {totalResults !== undefined && resultsPerPage !== undefined ? (
        <span className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">{totalResults === 0 ? 0 : (currentPage - 1) * resultsPerPage + 1}</span> to{" "}
          <span className="font-medium text-gray-900">
            {Math.min(currentPage * resultsPerPage, totalResults)}
          </span>{" "}
          of <span className="font-medium text-gray-900">{totalResults}</span> results
        </span>
      ) : (
        <div /> // Spacer if no results text is needed
      )}
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
              page === '...' ? 'cursor-default text-gray-400' :
              currentPage === page
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
