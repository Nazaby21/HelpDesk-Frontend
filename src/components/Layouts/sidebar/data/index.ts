import * as Icons from "../icons";
import { UserRole } from "@/app/role-context";
import { AlertTriangle, LayoutGrid } from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: any;
  roles: string[];
  items: NavItem[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const getNavData = (role: UserRole): NavSection[] => {

  const allItems = [
    {
      label: "MAIN MENU",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: Icons.HomeIcon,
          roles: ["admin", "technician"],
          items: [] as any[],
        },
        {
          title: "User Management",
          url: "/users",
          icon: Icons.User,
          roles: ["admin"],
          items: [] as any[],
        },
        {
          title: "View All Tickets",
          url: "/tickets",
          icon: Icons.Table,
          roles: ["admin", "technician"],
          items: [] as any[],
        },
        {
          title: "View History",
          url: "/user/history",
          icon: AlertTriangle,
          roles: ["technician", "admin"],
          items: [] as any[],
        },
        {
          title: "Category Management",
          url: "/categories",
          icon: LayoutGrid,
          roles: ["admin", "technician"],
          items: [] as any[],
        },
        {
          title: "Incident Catalog",
          url: "/incident-catalog",
          icon: Icons.Alphabet,
          roles: ["admin", "technician"],
          items: [] as any[],
        },
      ],
    },
  ];

  return allItems
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(role)),
    }))
    .filter((section) => section.items.length > 0);
};
