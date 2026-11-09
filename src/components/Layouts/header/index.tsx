"use client";

import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { Notification } from "./notification";
import { UserInfo } from "./user-info";
import { useRole } from "@/app/role-context";

export function Header() {
  const { toggleSidebar } = useSidebarContext();
  const { role } = useRole();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white px-4 py-3 shadow-1 dark:border-stroke-dark dark:bg-gray-dark md:px-5 2xl:px-10">
      <button
        onClick={toggleSidebar}
        className="rounded-lg border px-1.5 py-1 dark:border-stroke-dark dark:bg-[#020D1A] hover:dark:bg-[#FFFFFF1A] lg:hidden"
      >
        <MenuIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </button>

      {role === "user" && (
        <nav className="flex items-center gap-4 lg:gap-6 ml-4 lg:ml-6 mr-full">
          <Link
            href="/user/tickets"
            className="text-sm font-semibold text-dark hover:text-primary dark:text-white dark:hover:text-primary transition-colors"
          >
            My Tickets
          </Link>
          <Link
            href="/user/history"
            className="text-sm font-semibold text-dark hover:text-primary dark:text-white dark:hover:text-primary transition-colors"
          >
            History
          </Link>
          <Link
            href="/notifications"
            className="text-sm font-semibold text-dark hover:text-primary dark:text-white dark:hover:text-primary transition-colors"
          >
            Notifications
          </Link>
        </nav>
      )}

      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
        <Notification />

        <div className="shrink-0">
          <UserInfo />
        </div>
      </div>
    </header>
  );
}
