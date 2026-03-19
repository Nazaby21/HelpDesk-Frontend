import React from "react";
import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableHead, TableBody, TableRow } from "@/components/ui/table";
import { UserRow, User } from "./UserRow";

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
      <div className="mb-6 pb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-gray-100 dark:border-gray-800">
        {/* Left Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">User Management</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your team members and their account permissions here.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          {/* Search */}
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search users..."
              leftIcon={<Search className="h-4 w-4 text-gray-400" />}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full border-gray-300"
            />
          </div>

          {/* Add User Button */}
          <Link href="/users/add">
            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              className="w-full sm:w-auto"
              onClick={onAddClick}
            >
              Add User
            </Button>
          </Link>
        </div>
      </div>

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
