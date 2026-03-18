"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Toast } from "@/components/ui/Toast";

export default function TicketDetail() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;
  const [showToast, setShowToast] = useState(false);

  // In a real app, you would fetch the ticket details based on ticketId
  const ticket = {
    id: `TCK-${ticketId}`,
    title: "Cannot access company VPN",
    description:
      "I keep getting an 'Authentication Failed' error when trying to connect to the US-East VPN server. My password works for email but not the VPN client.",
    requester: { name: "Sarah Doe", email: "sarah@example.com" },
    department: "IT",
    priority: "High",
    status: "Pending",
    assignedTo: { name: "John Smith" },
    created: "Oct 24, 2024 at 09:41 AM",
    lastUpdated: "Oct 24, 2024 at 10:15 AM",
  };

  return (
    <div className="flex-1 bg-white p-4 md:p-6 font-inter">
      <div className="mx-auto w-full max-w-4xl">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tickets
        </button>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500">
                  {ticket.id}
                </span>
                <Badge variant="info">{ticket.status}</Badge>
                <Badge variant="warning">{ticket.priority}</Badge>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setShowToast(true)}
              >
                Assign to me
              </button>
              <button className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50">
                <MoreHorizontal className="h-5 w-5" />
              </button>
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
        </div>
      </div>

      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        message="Ticket successfully assigned"
      />
    </div>
  );
}
