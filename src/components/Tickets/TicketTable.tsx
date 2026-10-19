import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { TicketRow, Ticket } from "./TicketRow";
import { useRole } from "@/app/role-context";

interface TicketTableProps {
  tickets: Ticket[];
  title?: string;
  subtitle?: string;
  onActionClick: (action: string, ticket: Ticket) => void;
  onCreateClick?: () => void;
  onStatusFilterChange?: (status: string) => void;
  onSearchChange?: (value: string) => void;
  hideAssignedTo?: boolean;
  showCompletedDate?: boolean;
}

import { PageHeader } from "@/components/ui/PageHeader";

export function TicketTable({
  tickets,
  title = "All Tickets",
  subtitle = "View and manage all support tickets.",
  onActionClick,
  onCreateClick,
  onStatusFilterChange,
  onSearchChange,
  hideAssignedTo = false,
  showCompletedDate = false,
}: TicketTableProps) {
  const { role } = useRole();
  const isAuthorizedToCreate = role === 'admin' || role === 'user';

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={
          isAuthorizedToCreate && (
            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={onCreateClick}
              className="w-full sm:w-auto"
            >
              Create Ticket
            </Button>
          )
        }
      >
        <div className="w-full sm:w-64">
          <Input
            aria-label="Search tickets"
            placeholder="Search tickets..."
            leftIcon={<Search className="h-4 w-4 text-gray-400" />}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full border-gray-300"
          />
        </div>
        <select
          aria-label="Filter by status"
          onChange={(e) => onStatusFilterChange?.(e.target.value)}
          className="w-full sm:w-auto rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </PageHeader>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Ticket ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Requester</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            {!hideAssignedTo && <TableHead>Assigned To</TableHead>}
            <TableHead className="whitespace-nowrap">Created Date</TableHead>
            {showCompletedDate && <TableHead className="whitespace-nowrap">Completed Date</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8 + (hideAssignedTo ? 0 : 1) + (showCompletedDate ? 1 : 0)} className="py-8 text-center text-sm text-gray-500">
                No tickets found.
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket) => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                onActionClick={onActionClick}
                hideAssignedTo={hideAssignedTo}
                showCompletedDate={showCompletedDate}
              />
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}
