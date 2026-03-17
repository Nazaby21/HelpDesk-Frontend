"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, X, CheckCircle2, Loader2 } from "lucide-react";

export default function AddUserPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      setTimeout(() => setShowSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="flex-1 bg-white md:p-6 p-4">
      <div className="mx-auto w-full relative">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="border-b border-gray-200 px-6 py-5 flex items-start justify-between bg-white">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Add New User</h1>
              <p className="mt-1 text-sm text-gray-500">
                Create a new user and assign role and department.
              </p>
            </div>
            <Link 
              href="/user-management" 
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid gap-6">
              
              {/* Name Fields */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-shadow focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-shadow focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Contact Fields */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-shadow focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-shadow focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {/* Security */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm transition-shadow focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Optional Strength Indicator */}
                <div className="mt-2 flex gap-1">
                  <div className="h-1 w-full rounded-full bg-green-500"></div>
                  <div className="h-1 w-full rounded-full bg-green-500"></div>
                  <div className="h-1 w-full rounded-full bg-gray-200"></div>
                  <div className="h-1 w-full rounded-full bg-gray-200"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Strong password</p>
              </div>

              {/* Role & Department */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    required
                    defaultValue=""
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-shadow focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5 appearance-none bg-white"
                  >
                    <option value="" disabled>Select role</option>
                    <option value="Admin">Admin</option>
                    <option value="Technician">Technician</option>
                    <option value="User">User</option>
                  </select>
                  <p className="text-xs text-gray-500">
                    Admin has full access to the system.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <select
                    id="department"
                    defaultValue=""
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-shadow focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5 appearance-none bg-white"
                  >
                    <option value="" disabled>Select department</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Support">Support</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
              <Link
                href="/user-management"
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center min-w-[120px] rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </button>
            </div>
          </form>
        </div>

        {showSuccess && (
          <div className="absolute top-4 right-4 flex items-center gap-3 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-lg animate-in slide-in-from-top-5 fade-in duration-300">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            <span>User created successfully</span>
          </div>
        )}
      </div>
    </div>
  );
}
