"use client";

import React, { useState } from "react";
import { redirect } from "next/navigation";
import { Building2, Plus, Edit, Loader2 } from "lucide-react";
import { useRole } from "@/app/role-context";
import {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  Department,
} from "@/redux/feature/department/departmentApi";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";

export default function DepartmentsPage() {
  const { role } = useRole();
  if (role !== "admin") {
    redirect("/");
  }

  const { data: departments = [], isLoading } = useGetDepartmentsQuery();
  const [createDepartment, { isLoading: isCreating }] = useCreateDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const openCreateModal = () => {
    setEditingDept(null);
    setName("");
    setDescription("");
    setIsModalOpen(true);
  };

  const openEditModal = (dept: Department) => {
    setEditingDept(dept);
    setName(dept.name);
    setDescription(dept.description || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingDept) {
        await updateDepartment({
          id: editingDept.id,
          data: { name: name.trim(), description: description.trim() || undefined },
        }).unwrap();
        setToastMessage("Department updated successfully!");
      } else {
        await createDepartment({
          name: name.trim(),
          description: description.trim() || undefined,
        }).unwrap();
        setToastMessage("Department created successfully!");
      }
      setToastType("success");
      setShowToast(true);
      setIsModalOpen(false);
    } catch (err: any) {
      setToastType("error");
      setToastMessage(err?.data?.message || "Failed to save department.");
      setShowToast(true);
    }
  };

  return (
    <div className="mx-auto w-full">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-dark">
        <PageHeader
          title="Department Management"
          subtitle="Create and manage organizational departments for helpdesk users."
          action={
            <Button onClick={openCreateModal} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Department
            </Button>
          }
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
            <p>Loading departments...</p>
          </div>
        ) : departments.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
            No departments found. Click &quot;Add Department&quot; to create one.
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {dept.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {dept.description || "No description provided."}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => openEditModal(dept)}
                    className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    title="Edit Department"
                    aria-label={`Edit department ${dept.name}`}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDept ? "Edit Department" : "Create Department"}
        maxWidth="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="dept-name"
            label="Department Name"
            placeholder="e.g. IT Support, Human Resources"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe the department's responsibilities"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isCreating || isUpdating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating
                ? "Saving..."
                : editingDept
                ? "Save Changes"
                : "Create Department"}
            </Button>
          </div>
        </form>
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
