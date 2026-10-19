import React from "react";
import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableHead, TableBody, TableRow } from "@/components/ui/table";
import { UserRow, User } from "./UserRow";

import { PageHeader } from "@/components/ui/PageHeader";

interface UserTableProps {
  users: User[];
  onAddClick?: () => void;
  onSearchChange?: (value: string) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export function UserTable({
  users,
  onAddClick,
  onSearchChange,
  onEdit,
  onDelete,
}: UserTableProps) {
  return (
    <>
      <PageHeader
        title="User Management"
        subtitle="Manage your team members and their account permissions here."
        action={
          <Link href="/users/add" className="w-full sm:w-auto">
            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              className="w-full"
              onClick={onAddClick}
            >
              Add User
            </Button>
          </Link>
        }
      >
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search users..."
            leftIcon={<Search className="h-4 w-4 text-gray-400" />}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full border-gray-300"
          />
        </div>
      </PageHeader>

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          All users ({users.length})
        </h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Access</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-8 text-center text-sm text-gray-400">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}
