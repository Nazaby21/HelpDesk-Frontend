"use client";

import React, { useState } from "react";
import { Plus, ListTree, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  useGetCategoriesQuery,
  Category,
} from "@/redux/feature/category/categoryApi";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { UserRole } from "@/app/role-context";

export function CategoryManager({ role }: { role: UserRole }) {
  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

  if (isLoading) return <div className="p-8">Loading categories...</div>;

  const mainCategories = categories;

  const handleCreateMain = () => {
    setSelectedParentId(null);
    setIsModalOpen(true);
  };

  const handleCreateSub = (parentId: number) => {
    setSelectedParentId(parentId);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleCreateMain} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Main Category
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mainCategories.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
            No categories found. Create one to get started.
          </div>
        ) : (
          mainCategories.map((main) => {
            const subcategories = main.subCategories || [];

            return (
              <div
                key={main.id}
                className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {main.name}
                    </h3>
                    {main.description && (
                      <p className="mt-1 text-sm text-gray-500">
                        {main.description}
                      </p>
                    )}
                  </div>
                  {/* Optional: Edit button could go here */}
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                    <span className="flex items-center gap-2">
                      <ListTree className="h-4 w-4 text-blue-500" />
                      Sub-Issues ({subcategories.length})
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCreateSub(Number(main.id))}
                      className="h-7 text-xs"
                    >
                      <Plus className="mr-1 h-3 w-3" /> Add
                    </Button>
                  </div>

                  <ul className="space-y-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                    {subcategories.map((sub) => (
                      <li
                        key={sub.id}
                        className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm shadow-sm border border-gray-100 dark:border-gray-700 dark:bg-gray-800"
                      >
                        <span className="text-gray-700 dark:text-gray-200">
                          {sub.name}
                        </span>
                      </li>
                    ))}
                    {subcategories.length === 0 && (
                      <li className="text-xs text-gray-400 italic py-1 px-2">
                        No sub-issues yet
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            );
          })
        )}
      </div>

      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        parentId={selectedParentId}
        parentName={
          selectedParentId
            ? categories.find((c) => c.id === selectedParentId)?.name || ""
            : undefined
        }
      />
    </div>
  );
}
