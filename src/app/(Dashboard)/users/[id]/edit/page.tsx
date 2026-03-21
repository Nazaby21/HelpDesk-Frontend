"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
    <div className="mx-auto max-w-2xl w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
          <p className="text-sm text-gray-500 mt-1">
            Update user information and role.
          </p>
        </div>
        <Button
          variant="outline"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => router.push("/users")}
        >
          Back to Users
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
          <h2 className="font-medium text-gray-900">User Profile</h2>
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
