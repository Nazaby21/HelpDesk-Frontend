"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Toast } from "@/components/ui/Toast";
import { useGetTicketByIdQuery, useUpdateTicketStatusMutation } from "@/redux/feature/ticket/ticketApi";
import { useRole } from "@/app/role-context";
import { TicketChat } from "./TicketChat";

const priorityVariant: Record<string, "error" | "orange" | "warning" | "default"> = {
  HIGH: "error",
  HIGH_PRIORITY: "error",
  High: "error",
  MEDIUM: "orange",
  Medium: "orange",
  LOW: "warning",
  Low: "warning",
};

export default function TicketDetail() {
  const params = useParams();
  const router = useRouter();
  const { role } = useRole();
  const ticketId = params.id as string;
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { data: ticketResponse, isLoading } = useGetTicketByIdQuery(ticketId);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateTicketStatusMutation();

  const ticket = React.useMemo(() => {
    if (!ticketResponse) return null;
    const statusMap: Record<string, string> = {
      PENDING: "Pending",
      IN_PROGRESS: "In Progress",
      COMPLETED: "Completed",
    };
    const status = statusMap[ticketResponse.status] ?? ticketResponse.status;
    return {
      rawId: ticketResponse.id.toString(),
      id: `#TCK-${ticketResponse.id.toString().padStart(3, "0")}`,
      title: ticketResponse.ticketTitle || "Untitled Ticket",
      description: ticketResponse.description || "No description provided.",
      requester: { name: ticketResponse.createdByName || "Requester", email: "" },
      department: ticketResponse.categoryName || "General",
      priority: ticketResponse.priority || "Medium",
      rawStatus: ticketResponse.status,
      status,
      assignedTo: ticketResponse.assignedName ? { name: ticketResponse.assignedName } : null,
      created: ticketResponse.createdAt
        ? new Date(ticketResponse.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        : "Unknown",
    };
  }, [ticketResponse]);

  const handleAccept = async () => {
    try {
      await updateStatus({ id: ticketId, status: "IN_PROGRESS" }).unwrap();
      setToastMessage("Ticket accepted successfully!");
      setShowToast(true);
    } catch (err: any) {
      setToastMessage(err?.data?.message || "Failed to accept ticket.");
      setShowToast(true);
    }
  };

  const handleClose = async () => {
    try {
      await updateStatus({ id: ticketId, status: "COMPLETED" }).unwrap();
      setToastMessage("Ticket closed successfully!");
      setShowToast(true);
    } catch (err: any) {
      setToastMessage(err?.data?.message || "Failed to close ticket.");
      setShowToast(true);
    }
  };

  if (isLoading) return <div className="p-8">Loading ticket details...</div>;
  if (!ticket) return <div className="p-8">Ticket not found</div>;

  const pBadgeVariant = priorityVariant[ticket.priority] ?? "default";

  return (
    <>
      <div className="mx-auto w-full">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Header */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to tickets
          </button>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500">
                  {ticket.id}
                </span>
                <Badge variant="info">{ticket.status}</Badge>
                <Badge variant={pBadgeVariant}>{ticket.priority}</Badge>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
            </div>

            {/* Role-based action buttons */}
            <div className="flex items-center gap-3">
              {role === "technician" && ticket.rawStatus === "PENDING" && (
                <button
                  onClick={handleAccept}
                  disabled={isUpdating}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCircle className="h-4 w-4" />
                  {isUpdating ? "Accepting…" : "Accept"}
                </button>
              )}
              {role === "technician" && ticket.rawStatus === "IN_PROGRESS" && (
                <button
                  onClick={handleClose}
                  disabled={isUpdating}
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                  {isUpdating ? "Closing…" : "Close Ticket"}
                </button>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-sm text-gray-500">Requester</div>
              <div className="mt-1 font-medium text-gray-900">
                {ticket.requester.name}
              </div>
              <div className="text-sm text-gray-500">{ticket.requester.email}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Assigned To</div>
              <div className="mt-1 font-medium text-gray-900">
                {ticket.assignedTo?.name || "Unassigned"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Department</div>
              <div className="mt-1 font-medium text-gray-900">
                {ticket.department}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Created</div>
              <div className="mt-1 flex items-center gap-1.5 font-medium text-gray-900">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{ticket.created}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-gray-100 pt-8">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Description
            </h3>
            <div className="prose prose-sm max-w-none text-gray-600">
              <p>{ticket.description}</p>
            </div>
          </div>
          
          {/* Real-time Ticket Chat */}
          <TicketChat ticketId={ticket.rawId} />
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

