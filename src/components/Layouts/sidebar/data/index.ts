import * as Icons from "../icons";
import { UserRole } from "@/app/role-context";
import { INCIDENT_CATEGORIES } from "@/data/incidents";
import {
  Activity,
  AlertTriangle,
  Database,
  Headphones,
  LayoutGrid,
  Monitor,
  Server,
  Shield,
  Wifi,
} from "lucide-react";

const categoryIcons: Record<string, any> = {
  "IT Database Administration Issue": Database,
  "IT Incident Management": AlertTriangle,
  "IT In-House System Issue": Server,
  "IT MIS & Analytics Issue": Activity,
  "IT Network Issue": Wifi,
  "IT Security Issue": Shield,
  "IT Support Issue": Headphones,
  "IT System Issue": Monitor,
};

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
  if (role === "user") {
    return [
      {
        label: "INCIDENT CATALOG",
        items: INCIDENT_CATEGORIES.map((category) => ({
          title: category,
          url: `/incident-catalog?category=${encodeURIComponent(category)}`,
          icon: categoryIcons[category] || LayoutGrid,
          roles: ["user"],
          items: [] as any[],
        })),
      },
    ];
  }

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
          title: "View All Ticket",
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
          title: "Incident Catalog",
          url: "/incident-catalog",
          icon: Icons.Alphabet,
          roles: ["admin", "technician", "user"],
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
