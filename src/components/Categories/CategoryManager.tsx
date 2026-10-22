"use client";

import React, { useState } from "react";
import { Plus, ListTree, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "@/redux/feature/category/categoryApi";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { Toast } from "@/components/ui/Toast";
import { UserRole } from "@/app/role-context";

interface DeleteTarget {
  id: number | string;
  name: string;
  isSub: boolean;
}

export function CategoryManager({ role }: { role: UserRole }) {
  const { data: categories = [], isLoading, isError, error, refetch } = useGetCategoriesQuery();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  const mainCategories = categories;

  const handleCreateMain = () => {
    setSelectedParentId(null);
    setIsModalOpen(true);
  };

  const handleCreateSub = (parentId: number) => {
    setSelectedParentId(parentId);
    setIsModalOpen(true);
  };

  const handleDeleteClick	 = (id: number | string, name: string, isSub: boolean) => {
    setDeleteTarget({ id, name, isSub });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      await deleteCategory(deleteTarget.id).unwrap();
      setDeleteTarget(null);
      setToastType("success");
      setToastMessage("Category deleted successfully");
      setShowToast(true);
    } catch (err: any) {
      setToastType("error");
      setToastMessage(err?.data?.message || "Failed to delete category");
      setShowToast(true);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Category Management"
        subtitle="Manage main categories and their sub-issues."
        action={
          <Button onClick={handleCreateMain} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Main Category
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-gray-500">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
            <p>Loading categories...</p>
          </div>
        ) : isError ? (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50 p-8 text-center text-red-600 dark:border-red-900/50 dark:bg-red-900/10">
            <AlertTriangle className="mb-2 h-8 w-8" />
            <p className="mb-4">Failed to load categories.</p>
            <Button onClick={() => refetch()} variant="outline" className="border-red-200 hover:bg-red-100 hover:text-red-700">
              Retry
            </Button>
          </div>
        ) : mainCategories.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
            No categories found. Create one to get started.
          </div>
        ) : (
          mainCategories.map((main) => {
            const subcategories = main.subCategories || [];

            return (
              <div
                key={main.id}
                className="flex flex-col h-full rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {main.name}
                    </h3>
                    {main.description && (
                      <p 
                        className="mt-1 text-sm text-gray-500 line-clamp-2"
                        title={main.description}
                      >
                        {main.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteClick(main.id, main.name, false)}
                    className="ml-2 shrink-0 rounded-md p-2 min-h-[32px] min-w-[32px] flex items-center justify-center text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="Delete category"
                    aria-label={`Delete category ${main.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-auto space-y-3 pt-4 border-t border-gray-50 dark:border-gray-800/50">
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
                        <button
                          onClick={() => handleDeleteClick(sub.id, sub.name, true)}
                          className="shrink-0 rounded-md p-2 min-h-[32px] min-w-[32px] flex items-center justify-center text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                          title="Delete sub-issue"
                          aria-label={`Delete sub-issue ${sub.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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

      {/* Create Modal */}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title={deleteTarget?.isSub ? "Delete Sub-Issue" : "Delete Category"}
        maxWidth="sm"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900">
                  &quot;{deleteTarget?.name}&quot;
                </span>
                ?
              </p>
              {!deleteTarget?.isSub && (
                <p className="mt-2 text-sm text-red-600">
                  This will also delete all sub-issues under this category.
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      <Toast 
        isOpen={showToast} 
        onClose={() => setShowToast(false)} 
        message={toastMessage} 
        type={toastType} 
      />
    </div>
  );
}
