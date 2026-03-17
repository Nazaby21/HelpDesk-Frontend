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

export const getNavData = (role: UserRole) => {
  if (role === "user") {
    return [
      {
        label: "INCIDENT CATALOG",
        items: INCIDENT_CATEGORIES.map((category) => ({
          title: category,
          url: `/incident-catalog?category=${encodeURIComponent(category)}`,
          icon: categoryIcons[category] || LayoutGrid,
          roles: ["user"],
          items: [],
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
          items: [],
        },
        {
          title: "User Management",
          url: "/user-management",
          icon: Icons.User,
          roles: ["admin"],
          items: [],
        },
        {
          title: "View All Ticket",
          url: "/tickets",
          icon: Icons.Table,
          roles: ["admin", "technician"],
          items: [],
        },
        {
          title: "Incident Catalog",
          url: "/incident-catalog",
          icon: Icons.Alphabet,
          roles: ["admin", "technician", "user"],
          items: [],
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
