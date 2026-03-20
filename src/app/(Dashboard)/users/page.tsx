"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/ui/Pagination";
import { UserTable } from "@/components/Users/UserTable";
import { User } from "@/components/Users/UserRow";
import { Toast } from "@/components/ui/Toast";
import { useGetUsersQuery, useDeleteUserMutation } from "@/redux/feature/user/userApi";

export default function UsersPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleDelete = async (user: User) => {
    if (!window.confirm(`Are you sure you want to delete ${user.name}?`)) return;
    try {
      await deleteUser(user.id).unwrap();
      setToastMessage(`${user.name} was successfully deleted.`);
      setShowToast(true);
      refetch();
    } catch (err: any) {
      alert(err.data?.message || "Failed to delete user.");
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
      />
    </div>
  );
}
