"use client";

import React, { useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  useCreateDepartmentMutation,
  Department,
} from "@/redux/feature/department/departmentApi";

interface CreateDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (department: Department) => void;
}

export function CreateDepartmentModal({
  isOpen,
  onClose,
  onCreated,
}: CreateDepartmentModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [createDepartment, { isLoading }] = useCreateDepartmentMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Department name is required.");
      return;
    }

    try {
      const created = await createDepartment({ name: trimmed }).unwrap();
      onCreated(created);
      handleClose();
    } catch (err: any) {
      setError(
        err?.data?.message || "Failed to create department. Please try again."
      );
    }
  };

  const handleClose = () => {
    setName("");
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Department"
      description="Add a new department to the organization."
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-3 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
          <Building2 className="h-5 w-5 text-blue-500 shrink-0" />
          <p className="text-sm text-blue-700">
            The new department will immediately appear in the Department dropdown.
          </p>
        </div>

        <Input
          id="dept-name"
          label="Department Name"
          placeholder="e.g. Marketing, Finance, Operations"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error}
          required
          autoFocus
        />

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
              "Create Department"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
