"use client";

import React, { useState, useRef } from "react";
import { Eye, EyeOff, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useGetDepartmentsQuery } from "@/redux/feature/department/departmentApi";
import { CreateDepartmentModal } from "./CreateDepartmentModal";
import { Department } from "@/redux/feature/department/departmentApi";
import { useCreateUserMutation } from "@/redux/feature/user/userApi";
import { useRouter } from "next/navigation";

interface AddUserFormProps {
  onSubmit?: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function AddUserForm({ onSubmit, onCancel }: AddUserFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState("");

  // Form field state
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLSelectElement>(null);

  const { data: departments = [], isLoading: deptsLoading } =
    useGetDepartmentsQuery();

  const [createUser] = useCreateUserMutation();

  const departmentOptions = [
    { label: "Select department", value: "" },
    ...departments.map((d) => ({ label: d.name, value: String(d.id) })),
  ];

  const handleDepartmentCreated = (dept: Department) => {
    setSelectedDeptId(String(dept.id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      firstName: firstNameRef.current?.value || "",
      lastName: lastNameRef.current?.value || "",
      email: emailRef.current?.value || "",
      phone: phoneRef.current?.value || "",
      password: passwordRef.current?.value || "",
      role: roleRef.current?.value || "",
      departmentId: selectedDeptId || undefined,
    };

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        await createUser(formData).unwrap();
        router.push("/users");
      }
    } catch (err) {
      console.error("Failed to create user:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid gap-6">
          {/* Name Fields */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              id="firstName"
              label="First Name"
              placeholder="John"
              required
              ref={firstNameRef}
            />
            <Input
              id="lastName"
              label="Last Name"
              placeholder="Doe"
              required
              ref={lastNameRef}
            />
          </div>

          {/* Contact Fields */}
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="john.doe@example.com"
            required
            ref={emailRef}
          />
          <Input
            id="phone"
            type="tel"
            label="Phone Number"
            placeholder="+ (855) 12-345-678"
            ref={phoneRef}
          />

          {/* Security */}
          <div className="space-y-2">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="••••••••"
              required
              ref={passwordRef}
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
          </div>

          {/* Role & Department */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Select
              id="role"
              label="Role"
              required
              defaultValue=""
              ref={roleRef}
              hint="Admin has full access to the system."
              options={[
                { label: "Select role", value: "" },
                { label: "Admin", value: "ADMIN" },
                { label: "Technician", value: "TECHNICIAN" },
                { label: "User", value: "USER" },
              ]}
            />

            {/* Department field with "+ New" button */}
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700"
                >
                  Department
                </label>
                <button
                  type="button"
                  onClick={() => setShowDeptModal(true)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  title="Create a new department"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New Department
                </button>
              </div>
              <select
                id="department"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-black focus:ring-black/5 appearance-none bg-white"
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                disabled={deptsLoading}
              >
                {deptsLoading ? (
                  <option value="">Loading departments…</option>
                ) : (
                  departmentOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))
                )}
              </select>
            </div>
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

      {/* Create Department Modal */}
      <CreateDepartmentModal
        isOpen={showDeptModal}
        onClose={() => setShowDeptModal(false)}
        onCreated={handleDepartmentCreated}
      />
    </>
  );
}
