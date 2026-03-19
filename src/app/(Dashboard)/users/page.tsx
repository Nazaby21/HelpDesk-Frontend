"use client";

import React, { useState, useMemo } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { UserTable } from "@/components/Users/UserTable";
import { User } from "@/components/Users/UserRow";
import { Toast } from "@/components/ui/Toast";
import { useGetUsersQuery } from "@/redux/feature/user/userApi";

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);

  const { data: userResponses = [], isLoading } = useGetUsersQuery();

  const users: User[] = useMemo(() => {
    return userResponses.map((ur) => ({
      id: ur.id,
      name: `${ur.firstName} ${ur.lastName}`,
      email: ur.email,
      role: ur.role,
      lastActive: "Just now",
      dateAdded: "N/A",
      avatar: ur.imageUrl || null,
    }));
  }, [userResponses]);

  if (isLoading) return <div className="p-8">Loading users...</div>;

  return (
      <div className="mx-auto w-full">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <UserTable users={users} />

          <Pagination
            currentPage={currentPage}
            totalPages={6}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Demo Toast Logic */}
        <Toast
          isOpen={showToast}
          onClose={() => setShowToast(false)}
          message="Amélie Laurent details updated"
          secondaryAction={{ label: "Undo", onClick: () => console.log("Undo") }}
          action={{ label: "View profile", onClick: () => console.log("View") }}
        />
      </div>
  );
}
