"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface AddUserFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function AddUserForm({ onSubmit, onCancel }: AddUserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({
      // Collect form data here
    });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="grid gap-6">
        {/* Name Fields */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Input id="firstName" label="First Name" placeholder="John" required />
          <Input id="lastName" label="Last Name" placeholder="Doe" required />
        </div>

        {/* Contact Fields */}
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="john.doe@example.com"
          required
        />
        <Input
          id="phone"
          type="tel"
          label="Phone Number"
          placeholder="+1 (555) 000-0000"
        />

        {/* Security */}
        <div className="space-y-2">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="••••••••"
            required
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
          />
          {/* Optional Strength Indicator */}
          <div className="mt-2 flex gap-1">
            <div className="h-1 w-full rounded-full bg-green-500"></div>
            <div className="h-1 w-full rounded-full bg-green-500"></div>
            <div className="h-1 w-full rounded-full bg-gray-200"></div>
            <div className="h-1 w-full rounded-full bg-gray-200"></div>
          </div>
          <p className="mt-1 text-xs text-gray-500">Strong password</p>
        </div>

        {/* Role & Department */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Select
            id="role"
            label="Role"
            required
            defaultValue=""
            hint="Admin has full access to the system."
            options={[
              { label: "Select role", value: "" },
              { label: "Admin", value: "Admin" },
              { label: "Technician", value: "Technician" },
              { label: "User", value: "User" },
            ]}
          />

          <Select
            id="department"
            label="Department"
            defaultValue=""
            options={[
              { label: "Select department", value: "" },
              { label: "IT", value: "IT" },
              { label: "HR", value: "HR" },
              { label: "Finance", value: "Finance" },
              { label: "Support", value: "Support" },
              { label: "Sales", value: "Sales" },
            ]}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting} className="min-w-[120px]">
          Create User
        </Button>
      </div>
    </form>
  );
}
