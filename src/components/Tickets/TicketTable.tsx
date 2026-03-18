import React, { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableHead, TableBody } from "@/components/ui/table";
import { TicketRow, Ticket } from "./TicketRow";

interface TicketTableProps {
  tickets: Ticket[];
  onActionClick: (action: string, ticket: Ticket) => void;
  onCreateClick?: () => void;
  onFilterClick?: () => void;
  onSearchChange?: (value: string) => void;
}

export function TicketTable({
  tickets,
  onActionClick,
  onCreateClick,
  onFilterClick,
  onSearchChange,
}: TicketTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

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

          {/* Filter */}
          <Button
            variant="outline"
            leftIcon={<Filter className="h-4 w-4" />}
            onClick={onFilterClick}
            className="w-full sm:w-auto"
          >
            Filters
          </Button>

          {/* Create Ticket */}
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={onCreateClick}
            className="w-full sm:w-auto"
          >
            Create Ticket
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableHead className="whitespace-nowrap">Ticket ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Requester</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead className="whitespace-nowrap">Created Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              activeMenuId={activeMenuId}
              onMenuToggle={setActiveMenuId}
              onActionClick={onActionClick}
            />
          ))}
        </TableBody>
      </Table>
    </>
  );
}
