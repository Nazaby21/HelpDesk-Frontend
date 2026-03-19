"use client";

import React, { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { AddUserForm } from "@/components/Users/AddUserForm";

export default function AddUserPage() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (data: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  return (
      <div className="mx-auto w-full relative">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="flex items-start justify-between border-b border-gray-200 bg-white px-6 py-5">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Add New User</h1>
              <p className="mt-1 text-sm text-gray-500">
                Create a new user and assign role and department.
              </p>
            </div>
            <Link
              href="/users"
              className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Link>
          </div>

          <AddUserForm onSubmit={handleSubmit} onCancel={() => {}} />
        </div>

        {showSuccess && (
          <div className="absolute right-4 top-4 flex animate-in items-center gap-3 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-lg duration-300 slide-in-from-top-5 fade-in">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            <span>User created successfully</span>
          </div>
        )}
      </div>
  );
}
