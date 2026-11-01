"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { TicketDescription } from "@/components/Helpdesk/ticket/TicketDescription";
import { FileUploadBox } from "@/components/Helpdesk/ticket/FileUploadBox";
import { Toast } from "@/components/ui/Toast";
import {
  useGetTicketByIdQuery,
  useUpdateTicketMutation,
  useUploadImageMutation,
} from "@/redux/feature/ticket/ticketApi";
import { useGetCategoriesQuery } from "@/redux/feature/category/categoryApi";
import { useGetUsersQuery } from "@/redux/feature/user/userApi";
import { useRole } from "@/app/role-context";
import { Button } from "@/components/ui/Button";

interface EditTicketViewProps {
  id: string;
}

export function EditTicketView({ id }: EditTicketViewProps) {
  const router = useRouter();
  const { role } = useRole();
  const isAdmin = role === "admin";
  const { data: ticket, isLoading: isLoadingTicket, isError: isLoadError } = useGetTicketByIdQuery(id);
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: users = [] } = useGetUsersQuery(undefined, { skip: !isAdmin });
  const [updateTicket, { isLoading: isSubmitting }] = useUpdateTicketMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [subCategoryId, setSubCategoryId] = useState<number | undefined>(undefined);
  const [assignedTo, setAssignedTo] = useState<number | undefined>(undefined);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (ticket) {
      setTitle(ticket.ticketTitle || "");
      setDescription(ticket.description || "");
      setPriority(ticket.priority || "MEDIUM");
      setCategoryId(ticket.categoryId);
      setSubCategoryId(ticket.subCategoryId);
      setAssignedTo(ticket.assignedTo ?? undefined);
      if (ticket.imageUrls && ticket.imageUrls.length > 0) {
        setExistingImages(ticket.imageUrls);
      } else if (ticket.imageUrl) {
        setExistingImages([ticket.imageUrl]);
      }
    }
  }, [ticket]);

  const selectedCategory = categories.find((c) => Number(c.id) === Number(categoryId));
  const subCategories = selectedCategory?.subCategories || [];
  const technicians = users.filter(
    (u) => u.role?.toUpperCase() === "TECHNICIAN" || u.role?.toUpperCase() === "ADMIN"
  );

  const handleRemoveExistingImage = (indexToRemove: number) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setIsError(true);
      setToastMessage("Please enter a description for the ticket.");
      setShowToast(true);
      return;
    }

    try {
      let uploadedUrls: string[] = [];

      if (selectedFiles.length > 0) {
        try {
          const uploadPromises = selectedFiles.map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            const uploadRes = await uploadImage(formData).unwrap();
            return uploadRes.url;
          });
          uploadedUrls = await Promise.all(uploadPromises);
        } catch (uploadErr: any) {
          console.error("Failed to upload images:", uploadErr);
          setIsError(true);
          setToastMessage("Failed to upload images. Please try again.");
          setShowToast(true);
          return;
        }
      }

      const allImages = [...existingImages, ...uploadedUrls];

      await updateTicket({
        id,
        data: {
          ticketTitle: title || ticket?.ticketTitle || "Ticket",
          description,
          priority,
          categoryId: categoryId || ticket?.categoryId,
          subCategoryId: subCategoryId || undefined,
          assignedTo: assignedTo || undefined,
          imageUrls: allImages,
        },
      }).unwrap();

      setIsError(false);
      setToastMessage("Ticket updated successfully!");
      setShowToast(true);

      setTimeout(() => {
        router.push(`/tickets/${id}`);
      }, 1200);
    } catch (err: any) {
      console.error("Failed to update ticket:", err);
      setIsError(true);
      setToastMessage(err?.data?.message || "Failed to update ticket. Please try again.");
      setShowToast(true);
    }
  };

  if (isLoadingTicket) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isLoadError || !ticket) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load ticket #{id}. Please try again later.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl pb-12">
      <div className="mb-6 flex items-center justify-between border-b pb-4 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Ticket #{id}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Update details, category, assignment, and attachments for this ticket.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="rounded-lg"
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">
            Ticket Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-800 dark:focus:border-white dark:text-white"
            placeholder="Ticket Title"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">
              Ticket Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-800 dark:focus:border-white dark:text-white"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">
              Category
            </label>
            <select
              value={categoryId || ""}
              onChange={(e) => {
                setCategoryId(Number(e.target.value));
                setSubCategoryId(undefined);
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-800 dark:focus:border-white dark:text-white"
            >
              <option value="">Select Category</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {subCategories.length > 0 && (
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">
                Sub-Issue
              </label>
              <select
                value={subCategoryId || ""}
                onChange={(e) =>
                  setSubCategoryId(e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-800 dark:focus:border-white dark:text-white"
              >
                <option value="">Optional Sub-Issue</option>
                {subCategories.map((sub: any) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isAdmin && (
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">
                Assign Technician
              </label>
              <select
                value={assignedTo || ""}
                onChange={(e) =>
                  setAssignedTo(e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-800 dark:focus:border-white dark:text-white"
              >
                <option value="">Unassigned</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.firstName} {tech.lastName} ({tech.role})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <TicketDescription value={description} onChange={setDescription} />

        {existingImages.length > 0 && (
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <label className="mb-3 block text-sm font-semibold text-gray-900 dark:text-gray-100">
              Current Attachments
            </label>
            <div className="flex flex-wrap gap-4">
              {existingImages.map((url, idx) => (
                <div key={idx} className="relative group rounded-lg border p-1 dark:border-gray-700">
                  <Image
                    src={url}
                    alt="Attachment"
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(idx)}
                    className="absolute -top-2 -right-2 rounded-full bg-red p-1 text-white text-xs hover:bg-opacity-90"
                    title="Remove attachment"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <FileUploadBox files={selectedFiles} onFilesChange={setSelectedFiles} />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting || isUploading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="min-w-[140px]"
          >
            {isSubmitting || isUploading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      <Toast
        isOpen={showToast}
        message={toastMessage}
        type={isError ? "error" : "success"}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
