"use client";

import React, { useState } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { UserTable } from "@/components/Users/UserTable";
import { Toast } from "@/components/ui/Toast";

// Mock Data
const users = [
  {
    id: 1,
    name: "Amélie Laurent",
    email: "amelie@example.com",
    role: "Admin",
    lastActive: "Oct 24, 2024",
    dateAdded: "Oct 24, 2024",
    avatar: "https://i.pravatar.cc/150?u=amelie",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john@example.com",
    role: "Technician",
    lastActive: "Oct 23, 2024",
    dateAdded: "Oct 20, 2024",
    avatar: "https://i.pravatar.cc/150?u=john",
  },
  {
    id: 3,
    name: "Sarah Doe",
    email: "sarah@example.com",
    role: "User",
    lastActive: "Oct 22, 2024",
    dateAdded: "Oct 15, 2024",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
];

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);

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
