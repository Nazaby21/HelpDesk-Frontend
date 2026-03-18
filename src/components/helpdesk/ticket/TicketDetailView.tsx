import React from "react";
import { TicketHeader } from "@/components/Helpdesk/ticket/TicketHeader";
import { TicketDescription } from "@/components/Helpdesk/ticket/TicketDescription";
import { FileUploadBox } from "@/components/Helpdesk/ticket/FileUploadBox";
import { ConversationPanel } from "@/components/Helpdesk/ticket/ConversationPanel";
import { TicketSidebar } from "@/components/Helpdesk/ticket/TicketSidebar";
import { RequesterProfileCard } from "@/components/Helpdesk/ticket/RequesterProfileCard";
import { AssignmentFields } from "@/components/Helpdesk/ticket/AssignmentFields";

interface TicketDetailViewProps {
  id: string;
  incidentTitle: string;
  incidentCategory: string;
}

export function TicketDetailView({ id, incidentTitle, incidentCategory }: TicketDetailViewProps) {
  return (
    <div className="min-h-screen pb-12 w-full max-w-7xl mx-auto">
      <TicketHeader
        id={id.padStart(4, "683")} // Mock ID to match #6837 style if needed, or just use `id`
        title={`Request ${incidentCategory.replace("Issue", "")} for ${incidentTitle}`}
        creatorName="Zaby"
        createdDate="Jul 31, 2024 04:35 PM"
        dueDate="Aug 1, 2024 08:20 AM"
        assignedTeam="IT Support Team"
      />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Main Content (2/3 width on large screens) */}
        <div className="lg:col-span-2">
          {/* <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 px-6 py-2">
            <TicketTabs />
          </div> */}
          
          <div className="space-y-6">
            <AssignmentFields />
            <TicketDescription />
            <FileUploadBox />
            <ConversationPanel />
          </div>
        </div>

        {/* Right Column: Sidebar (1/3 width on large screens) */}
        <div className="lg:col-span-1 space-y-6">
          <TicketSidebar />
          <RequesterProfileCard />
        </div>
      </div>
    </div>
  );
}
