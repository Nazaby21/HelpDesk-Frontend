import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableHead, TableBody, TableRow } from "@/components/ui/table";
import { TicketRow, Ticket } from "./TicketRow";
import { useRole } from "@/app/role-context";

interface TicketTableProps {
  tickets: Ticket[];
  onActionClick: (action: string, ticket: Ticket) => void;
  onCreateClick?: () => void;
  onStatusFilterChange?: (status: string) => void;
  onSearchChange?: (value: string) => void;
  hideAssignedTo?: boolean;
  showCompletedDate?: boolean;
}

export function TicketTable({
  tickets,
  onActionClick,
  onCreateClick,
  onStatusFilterChange,
  onSearchChange,
  hideAssignedTo = false,
  showCompletedDate = false,
}: TicketTableProps) {
  const { role } = useRole();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const isAuthorizedToCreate = role === 'admin' || role === 'user';

  return (
    <>
      <div className="mb-6 pb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-gray-100 dark:border-gray-800">
        {/* Left Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            All Tickets
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all support tickets.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          
          {/* Search */}
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search tickets..."
              leftIcon={<Search className="h-4 w-4 text-gray-400" />}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full border-gray-300"
            />
          </div>

          {/* Filter Status */}
          <select
            onChange={(e) => onStatusFilterChange?.(e.target.value)}
            className="w-full sm:w-auto rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          {/* Create Ticket */}
          {isAuthorizedToCreate && (
            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={onCreateClick}
              className="w-full sm:w-auto"
            >
              Create Ticket
            </Button>
          )}
        </div>
      </div>

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
          {tickets.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              activeMenuId={activeMenuId}
              onMenuToggle={setActiveMenuId}
              onActionClick={onActionClick}
              hideAssignedTo={hideAssignedTo}
              showCompletedDate={showCompletedDate}
            />
          ))}
        </TableBody>
      </Table>
    </>
  );
}
