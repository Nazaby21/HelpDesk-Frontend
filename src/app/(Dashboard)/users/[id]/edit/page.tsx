"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { X } from "lucide-react";
import Link from "next/link";
import { EditUserForm } from "@/components/Users/EditUserForm";
import { useGetUserByIdQuery } from "@/redux/feature/user/userApi";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const { data: user, isLoading, isError } = useGetUserByIdQuery(userId, {
    skip: !userId,
  });

  return (
    <div className="mx-auto w-full relative">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="flex items-start justify-between border-b border-gray-200 bg-white px-6 py-5">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Edit User</h1>
            <p className="mt-1 text-sm text-gray-500">
              Update user information and role.
            </p>
          </div>
          <Link
            href="/users"
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading user details...</div>
        ) : isError || !user ? (
          <div className="p-8 text-center text-red-500">Failed to load user details.</div>
        ) : (
          <EditUserForm user={user} onCancel={() => router.push("/users")} />
        )}
      </div>
    </div>
  );
}
