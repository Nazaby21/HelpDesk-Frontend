import Link from "next/link";
import { Search, Filter, Plus, MoreHorizontal } from "lucide-react";
import Image from "next/image";

// Placeholder data
const users = [
  {
    id: 1,
    name: "Amélie Laurent",
    email: "amelie@example.com",
    role: "Admin",
    lastActive: "Oct 24, 2024",
    dateAdded: "Oct 24, 2024",
    avatar: "https://i.pravatar.cc/150?u=amelie",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john@example.com",
    role: "Technician",
    lastActive: "Oct 23, 2024",
    dateAdded: "Oct 20, 2024",
    avatar: "https://i.pravatar.cc/150?u=john",
  },
  {
    id: 3,
    name: "Sarah Doe",
    email: "sarah@example.com",
    role: "User",
    lastActive: "Oct 22, 2024",
    dateAdded: "Oct 15, 2024",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
];

const RoleBadge = ({ role }: { role: string }) => {
  const styles: Record<string, string> = {
    Admin: "bg-green-100 text-green-700",
    Technician: "bg-blue-100 text-blue-700",
    User: "bg-purple-100 text-purple-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        styles[role] || "bg-gray-100 text-gray-700"
      }`}
    >
      {role}
    </span>
  );
};

export default function UserManagementPage() {
  return (
    <div className="flex-1 bg-white md:p-6 p-4">
      <div className="mx-auto w-full">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Header Section */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                User management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your team members and their account permissions here.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                Filters
              </button>

              <Link
                href="/user-management/add"
                className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                <Plus className="h-4 w-4" />
                Add user
              </Link>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              All users ({users.length})
            </h2>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="py-3 pl-4 pr-3 font-medium">User</th>
                  <th className="px-3 py-3 font-medium">Access</th>
                  <th className="px-3 py-3 font-medium">Last active</th>
                  <th className="px-3 py-3 font-medium">Date added</th>
                  <th className="px-4 py-3 text-right font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="group transition-colors hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="py-4 pl-4 pr-3">
                      <div className="flex items-center gap-3">
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={32}
                          height={32}
                          className="rounded-full bg-gray-100 object-cover"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-3 py-4 text-gray-500">
                      {user.lastActive}
                    </td>
                    <td className="px-3 py-4 text-gray-500">
                      {user.dateAdded}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5, 6].map((page) => (
              <button
                key={page}
                className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                  page === 1
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>

        {/* Toast Notification Placeholder */}
        <div className="fixed bottom-6 right-6 hidden md:flex items-center gap-4 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-lg animate-in slide-in-from-bottom-5">
          <span>Amélie Laurent details updated</span>
          <div className="flex items-center gap-3">
            <button className="font-medium text-gray-300 hover:text-white underline-offset-2 hover:underline">
              Undo
            </button>
            <button className="font-medium text-white underline-offset-2 hover:underline">
              View profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
