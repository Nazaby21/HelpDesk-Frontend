import { useGetCategoriesQuery } from "@/redux/feature/category/categoryApi";
import {
  Activity,
  AlertTriangle,
  Database,
  Headphones,
  LayoutGrid,
  Monitor,
  Search,
  Server,
  Shield,
  Wifi,
} from "lucide-react";
import React, { useState } from "react";

interface SidebarProps {
  activeCategory: string;
  onCategorySelect: (category: string) => void;
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

export const Sidebar: React.FC<SidebarProps> = ({
  activeCategory,
  onCategorySelect,
}) => {
  const { data: categories = [] } = useGetCategoriesQuery();
  const [search, setSearch] = useState("");

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full md:w-80 bg-[#f5f5f5] h-full rounded-2xl p-6 flex flex-col gap-6 shadow-sm shrink-0">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        Incident Catalog
      </h2>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full rounded-xl border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700"
          placeholder="Search templates"
        />
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto">
        {filtered.map((category) => {
          const Icon = categoryIcons[category.name] || LayoutGrid;
          const isActive = category.name === activeCategory;

          return (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.name)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left
                ${
                  isActive
                    ? "bg-white text-primary border-l-4 border-primary shadow-sm"
                    : "text-gray-600 hover:bg-white hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 border-l-4 border-transparent"
                }
              `}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
