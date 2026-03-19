"use client";

import React, { useState } from "react";
import { Loader2, Tags } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCreateCategoryMutation } from "@/redux/feature/category/categoryApi";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentId?: number | null;
  parentName?: string;
}

export function CreateCategoryModal({
  isOpen,
  onClose,
  parentId = null,
  parentName,
}: CreateCategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const isSubCategory = parentId !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }

    try {
      await createCategory({
        name: trimmedName,
        description: description.trim() || undefined,
        parentId,
      }).unwrap();
      handleClose();
    } catch (err: any) {
      setError(
        err?.data?.message || "Failed to create category. Please try again."
      );
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isSubCategory ? "Create Sub-Issue" : "Create Main Category"}
      description={
        isSubCategory
          ? `Add a specific sub-issue under ${parentName}.`
          : "Add a new top-level category mapping."
      }
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-3 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 dark:bg-blue-900/20 dark:border-blue-800">
          <Tags className="h-5 w-5 text-blue-500 shrink-0" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            This category will be immediately available in the system.
          </p>
        </div>

        <Input
          id="cat-name"
          label={isSubCategory ? "Sub-Issue Name" : "Category Name"}
          placeholder={isSubCategory ? "e.g. Payment Gateway" : "e.g. Finance"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error}
          required
          autoFocus
        />

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Description (Optional)
          </label>
          <textarea
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            rows={3}
            placeholder="Briefly describe this category"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Category"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
