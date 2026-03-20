"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TicketHeader } from "@/components/Helpdesk/ticket/TicketHeader";
import { TicketDescription } from "@/components/Helpdesk/ticket/TicketDescription";
import { FileUploadBox } from "@/components/Helpdesk/ticket/FileUploadBox";
import { Toast } from "@/components/ui/Toast";
import { useAppSelector } from "@/redux/hooks";
import { useCreateTicketMutation, useUploadImageMutation } from "@/redux/feature/ticket/ticketApi";
import { useGetCategoriesQuery } from "@/redux/feature/category/categoryApi";

interface TicketDetailViewProps {
  id: string;
}

export function TicketDetailView({ id }: TicketDetailViewProps) {
  const router = useRouter();
  const { user } = useAppSelector((state: any) => state.auth);
  const [description, setDescription] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [priority, setPriority] = useState("MEDIUM");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { data: categories = [] } = useGetCategoriesQuery();
  const [createTicket, { isLoading: isSubmitting }] = useCreateTicketMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  // Find the subcategory using the 'id' passed from the route
  let selectedMainCategory = null;
  let selectedSubCategory = null;

  for (const main of categories) {
    const sub = main.subCategories?.find((sub: any) => sub.id.toString() === id);
    if (sub) {
      selectedMainCategory = main;
      selectedSubCategory = sub;
      break;
    }
  }

  const incidentTitle = selectedSubCategory ? selectedSubCategory.name : "Issue";
  const incidentCategory = selectedMainCategory ? selectedMainCategory.name : "";

  const handleSubmit = async () => {
    if (!description.trim()) {
      setIsError(true);
      setToastMessage("Please enter a description for the ticket.");
      setShowToast(true);
      return;
    }

    if (!selectedMainCategory || !selectedSubCategory) {
      setIsError(true);
      setToastMessage("Invalid category mapping. Please try again.");
      setShowToast(true);
      return;
    }

    try {
      let imageUrls: string[] | undefined = undefined;

      if (selectedFiles.length > 0) {
        try {
          const uploadPromises = selectedFiles.map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            const uploadRes = await uploadImage(formData).unwrap();
            return uploadRes.url;
          });
          imageUrls = await Promise.all(uploadPromises);
        } catch (uploadErr: any) {
          console.error("Failed to upload images:", uploadErr);
          setIsError(true);
          setToastMessage("Failed to upload images. Please try again or remove some files.");
          setShowToast(true);
          return;
        }
      }

      const response = await createTicket({
        ticketTitle: incidentTitle,
        description,
        categoryId: Number(selectedMainCategory.id),
        subCategoryId: Number(selectedSubCategory.id),
        priority,
        status: "PENDING",
        ...(imageUrls && imageUrls.length > 0 && { imageUrls }),
      }).unwrap();

      setIsError(false);
      setToastMessage("Ticket submitted successfully!");
      setShowToast(true);

      setTimeout(() => {
        router.push(`/tickets/${response.id}`);
      }, 1500);
    } catch (err: any) {
      console.error("Failed to submit ticket:", err);
      setIsError(true);
      setToastMessage(err?.data?.message || "Failed to submit ticket. Please try again.");
      setShowToast(true);
    }
  };

  return (
    <>
      <div className="min-h-screen pb-12 w-full max-w-7xl mx-auto">
        <TicketHeader
          id=""
          title={`Request ${incidentCategory.replace("Issue", "")} for ${incidentTitle}`}
          creatorName={user ? `${user.firstName} ${user.lastName}` : "Current User"}
          createdDate={new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          dueDate="Pending Review"
          assignedTeam={incidentCategory || "Support"}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting || isUploading}
        />

        <div className="mt-8 max-w-3xl space-y-6">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
              Ticket Priority
            </h3>
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
          
          <TicketDescription value={description} onChange={setDescription} />
          <FileUploadBox files={selectedFiles} onFilesChange={setSelectedFiles} />
        </div>
      </div>

      <Toast 
        isOpen={showToast} 
        onClose={() => setShowToast(false)} 
        message={toastMessage} 
      />
    </>
  );
}

