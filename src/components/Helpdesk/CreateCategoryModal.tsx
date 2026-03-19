"use client";

import React, { useState } from "react";
import { LayoutGrid, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  useCreateCategoryMutation,
  Category,
} from "@/redux/feature/category/categoryApi";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (category: Category) => void;
}

export function CreateCategoryModal({
  isOpen,
  onClose,
  onCreated,
}: CreateCategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");
  const [apiError, setApiError] = useState("");
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError("");
    setApiError("");

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("Category name is required.");
      return;
    }

    try {
      const created = await createCategory({
        name: trimmedName,
        description: description.trim() || undefined,
      }).unwrap();
      onCreated?.(created);
      handleClose();
    } catch (err: any) {
      setApiError(
        err?.data?.message || "Failed to create category. Please try again."
      );
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setNameError("");
    setApiError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Category"
      description="Add a new incident catalog category."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-3 rounded-lg bg-violet-50 border border-violet-100 px-4 py-3">
          <LayoutGrid className="h-5 w-5 text-violet-500 shrink-0" />
          <p className="text-sm text-violet-700">
            The new category will appear in the Incident Catalog grid for all users.
          </p>
        </div>

        <Input
          id="cat-name"
          label="Category Name"
          placeholder="e.g. Finance, HR System, Network"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={nameError}
          required
          autoFocus
        />

        <div className="space-y-2">
          <label
            htmlFor="cat-description"
            className="block text-sm font-medium text-gray-700"
          >
            Description{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="cat-description"
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-shadow resize-none"
            placeholder="Brief description of this category…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {apiError && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            {apiError}
          </p>
        )}

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
                Creating…
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
