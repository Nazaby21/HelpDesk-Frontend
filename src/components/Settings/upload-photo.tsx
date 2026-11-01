"use client";

import React, { useState } from "react";
import { UploadIcon } from "@/assets/icons";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectCurrentUser, updateUserProfile } from "@/redux/feature/auth/authSlice";
import {
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
} from "@/redux/feature/user/userApi";
import { useUploadImageMutation } from "@/redux/feature/ticket/ticketApi";
import { Toast } from "@/components/ui/Toast";

export function UploadPhotoForm() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: fetchedUser } = useGetCurrentUserQuery();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [updateCurrentUser, { isLoading: isSaving }] = useUpdateCurrentUserMutation();

  const activeUser = fetchedUser || currentUser;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDeletePhoto = async () => {
    try {
      const updated = await updateCurrentUser({ imageUrl: null }).unwrap();
      setPreviewUrl(null);
      setSelectedFile(null);
      if (currentUser) {
        dispatch(updateUserProfile({ imageUrl: updated.imageUrl }));
      }
      setToastType("success");
      setToastMessage("Profile photo removed.");
      setShowToast(true);
    } catch (err: any) {
      setToastType("error");
      setToastMessage(err?.data?.message || "Failed to remove photo.");
      setShowToast(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setToastType("error");
      setToastMessage("Please select an image file first.");
      setShowToast(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const { url } = await uploadImage(formData).unwrap();

      const updated = await updateCurrentUser({ imageUrl: url }).unwrap();
      setSelectedFile(null);
      setPreviewUrl(null);
      if (currentUser) {
        dispatch(updateUserProfile({ imageUrl: updated.imageUrl }));
      }
      setToastType("success");
      setToastMessage("Profile photo updated successfully!");
      setShowToast(true);
    } catch (err: any) {
      setToastType("error");
      setToastMessage(err?.data?.message || "Failed to upload photo.");
      setShowToast(true);
    }
  };

  const displaySrc =
    previewUrl || activeUser?.imageUrl || "/images/user/user-03.png";

  return (
    <ShowcaseSection title="Your Photo" className="!p-7">
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex items-center gap-3">
          <Image
            src={displaySrc}
            width={55}
            height={55}
            alt="User"
            className="size-14 rounded-full object-cover"
            quality={90}
            unoptimized
          />

          <div>
            <span className="mb-1.5 block font-medium text-dark dark:text-white">
              Edit your photo
            </span>
            <span className="flex gap-3">
              <button
                type="button"
                onClick={handleDeletePhoto}
                disabled={isSaving || isUploading}
                className="text-body-sm hover:text-red"
              >
                Delete
              </button>
              <label
                htmlFor="profilePhoto"
                className="cursor-pointer text-body-sm hover:text-primary"
              >
                Choose File
              </label>
            </span>
          </div>
        </div>

        <div className="relative mb-5.5 block w-full rounded-xl border border-dashed border-gray-4 bg-gray-2 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary">
          <input
            type="file"
            name="profilePhoto"
            id="profilePhoto"
            accept="image/png, image/jpg, image/jpeg"
            onChange={handleFileChange}
            hidden
          />

          <label
            htmlFor="profilePhoto"
            className="flex cursor-pointer flex-col items-center justify-center p-4 sm:py-7.5"
          >
            <div className="flex size-13.5 items-center justify-center rounded-full border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark">
              <UploadIcon />
            </div>

            <p className="mt-2.5 text-body-sm font-medium">
              <span className="text-primary">Click to upload</span> or drag and
              drop
            </p>

            <p className="mt-1 text-body-xs">
              {selectedFile
                ? `Selected: ${selectedFile.name}`
                : "PNG or JPG (max, 800 X 800px)"}
            </p>
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="flex justify-center rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
            type="button"
            onClick={() => {
              setSelectedFile(null);
              setPreviewUrl(null);
            }}
          >
            Cancel
          </button>
          <button
            className="flex items-center justify-center rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90 disabled:opacity-50"
            type="submit"
            disabled={isUploading || isSaving || !selectedFile}
          >
            {isUploading || isSaving ? "Saving..." : "Save"}
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
