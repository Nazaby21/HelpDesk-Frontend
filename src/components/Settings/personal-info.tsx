"use client";

import React, { useState, useEffect } from "react";
import { UserIcon } from "@/assets/icons";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectCurrentUser, updateUserProfile } from "@/redux/feature/auth/authSlice";
import {
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
} from "@/redux/feature/user/userApi";
import { Toast } from "@/components/ui/Toast";

export function PersonalInfoForm() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: fetchedUser } = useGetCurrentUserQuery();
  const [updateCurrentUser, { isLoading }] = useUpdateCurrentUserMutation();

  const activeUser = fetchedUser || currentUser;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    if (activeUser) {
      setFirstName(activeUser.firstName || "");
      setLastName(activeUser.lastName || "");
      setPhoneNumber(activeUser.phoneNumber || "");
    }
  }, [activeUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setToastType("error");
      setToastMessage("First name and last name are required.");
      setShowToast(true);
      return;
    }

    try {
      const updated = await updateCurrentUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim() || null,
        ...(password.trim() ? { password: password.trim() } : {}),
      }).unwrap();

      if (currentUser) {
        dispatch(
          updateUserProfile({
            firstName: updated.firstName,
            lastName: updated.lastName,
            phoneNumber: updated.phoneNumber,
            imageUrl: updated.imageUrl,
          })
        );
      }
      setPassword("");
      setToastType("success");
      setToastMessage("Profile updated successfully!");
      setShowToast(true);
    } catch (err: any) {
      setToastType("error");
      setToastMessage(err?.data?.message || "Failed to update profile.");
      setShowToast(true);
    }
  };

  return (
    <ShowcaseSection title="Personal Information" className="!p-7">
      <form onSubmit={handleSubmit}>
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-2.5 block text-body-sm font-medium text-dark dark:text-white">
              First Name
            </label>
            <div className="relative">
              <span className="absolute left-4.5 top-1/2 -translate-y-1/2">
                <UserIcon />
              </span>
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                required
                className="w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-12.5 pr-4.5 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-2.5 block text-body-sm font-medium text-dark dark:text-white">
              Last Name
            </label>
            <div className="relative">
              <span className="absolute left-4.5 top-1/2 -translate-y-1/2">
                <UserIcon />
              </span>
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                required
                className="w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-12.5 pr-4.5 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-2.5 block text-body-sm font-medium text-dark dark:text-white">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={activeUser?.email || ""}
              disabled
              className="w-full rounded-lg border border-stroke bg-gray-2 py-2.5 px-4.5 text-dark opacity-70 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-2.5 block text-body-sm font-medium text-dark dark:text-white">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+855 12 345 678"
              className="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4.5 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5">
          <label className="mb-2.5 block text-body-sm font-medium text-dark dark:text-white">
            New Password (leave blank to keep current)
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4.5 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center rounded-lg bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        type={toastType}
      />
    </ShowcaseSection>
  );
}
