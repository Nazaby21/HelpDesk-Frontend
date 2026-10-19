"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/ui/Pagination";
import { UserTable } from "@/components/Users/UserTable";
import { User } from "@/components/Users/UserRow";
import { Toast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useGetUsersQuery, useDeleteUserMutation } from "@/redux/feature/user/userApi";

export default function UsersPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const { data: userResponses = [], isLoading, refetch } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const itemsPerPage = 10;

  const users: User[] = useMemo(() => {
    // 1. Map API data to our User format
    const mapped = userResponses.map((ur) => ({
      id: ur.id,
      name: `${ur.firstName} ${ur.lastName}`,
      email: ur.email,
      role: ur.role,
      lastActive: ur.updatedAt || null,
      createdAt: ur.createdAt || null,
      avatar: ur.imageUrl || null,
    }));

    // 2. Filter by search query
    if (!searchQuery.trim()) return mapped;

    const lowerQuery = searchQuery.toLowerCase();
    return mapped.filter(
      (u) =>
        u.name.toLowerCase().includes(lowerQuery) ||
        u.email.toLowerCase().includes(lowerQuery) ||
        u.role.toLowerCase().includes(lowerQuery)
    );
  }, [userResponses, searchQuery]);

  // 3. Paginate — only show the current page's slice
  const totalPages = Math.ceil(users.length / itemsPerPage) || 1;
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (user: User) => {
    setDeleteTarget(user);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.id).unwrap();
      setToastType("success");
      setToastMessage(`${deleteTarget.name} was successfully deleted.`);
      setShowToast(true);
      setDeleteTarget(null);
      refetch();
    } catch (err: any) {
      setToastType("error");
      setToastMessage(err?.data?.message || "Failed to delete user.");
      setShowToast(true);
    }
  };

  const handleEdit = (user: User) => {
    router.push(`/users/${user.id}/edit`);
  };

  if (isLoading) return <div className="p-8">Loading users...</div>;

  return (
    <div className="mx-auto w-full">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <UserTable
          users={paginatedUsers}
          onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalResults={users.length}
          resultsPerPage={itemsPerPage}
        />
      </div>

      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        type={toastType}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete User"
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
                  {deleteTarget?.name}
                </span>
                ?
              </p>
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
              onClick={confirmDelete}
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
    </div>
  );
}
