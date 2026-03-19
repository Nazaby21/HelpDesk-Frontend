"use client";

import { useGetCategoriesQuery } from "@/redux/feature/category/categoryApi";
import {
  Activity,
  AlertTriangle,
  Database,
  Headphones,
  LayoutGrid,
  Loader2,
  Monitor,
  Plus,
  Search,
  Server,
  Shield,
  Wifi,
} from "lucide-react";
import React, { useState } from "react";

interface CategoryGridProps {
  onCategorySelect: (category: string) => void;
  onCreateCategory?: () => void;
}

const categoryIcons: Record<string, React.ElementType> = {
  "IT Incident Management": AlertTriangle,
  "IT In-House System Issue": Server,
  "IT MIS & Analytics Issue": Activity,
  "IT Network Issue": Wifi,
  "IT Security Issue": Shield,
  "IT Support Issue": Headphones,
  "IT System Issue": Monitor,
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  onCategorySelect,
  onCreateCategory,
}) => {
  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const [search, setSearch] = useState("");

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="px-8 flex flex-col md:flex-row justify-between md:items-center py-6 border-b border-gray-100 dark:border-gray-800 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Incident Catalog
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select a category to report an issue or request what you need.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-xl border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700"
              placeholder="Search categories"
            />
          </div>
          {onCreateCategory && (
            <button
              onClick={onCreateCategory}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition-colors shrink-0"
            >
              <Plus className="h-4 w-4" />
              Create Category
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32 text-gray-400">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading categories…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            {search ? "No categories match your search." : "No categories found. Create one to get started."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((category) => {
              const Icon = categoryIcons[category.name] || LayoutGrid;
              return (
                <button
                  key={category.id}
                  onClick={() => onCategorySelect(category.name)}
                  className="group flex flex-col items-center justify-center p-8 rounded-xl bg-white shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 dark:border-gray-800 dark:bg-gray-900 hover:border-primary/50 dark:hover:border-primary/50 text-center gap-4"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
