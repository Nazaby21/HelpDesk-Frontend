export interface Incident {
  id: string;
  title: string;
  category: string;
  highlighted?: boolean;
}

export const INCIDENT_CATEGORIES = [
  "IT Incident Management",
  "IT In-House System Issue",
  "IT MIS & Analytics Issue",
  "IT Network Issue",
  "IT Security Issue",
  "IT Support Issue",
  "IT System Issue",
];

export const INCIDENT_TEMPLATES: Incident[] = [
  // 1. IT Database Administration Issue
  { id: "db-2", title: "Slow database performance", category: "IT Database Administration Issue" },
  { id: "db-3", title: "Data not saving to database", category: "IT Database Administration Issue" },
  { id: "db-4", title: "Database backup failed", category: "IT Database Administration Issue" },
  { id: "db-5", title: "Data inconsistency", category: "IT Database Administration Issue" },
  { id: "db-6", title: "User permission issue in database", category: "IT Database Administration Issue" },
  { id: "db-7", title: "Database server down", category: "IT Database Administration Issue" },

  // 2. IT Incident Management
  { id: "inc-1", title: "System outage", category: "IT Incident Management" },
  { id: "inc-2", title: "Service unavailable", category: "IT Incident Management" },
  { id: "inc-3", title: "Application crash", category: "IT Incident Management" },
  { id: "inc-4", title: "Unexpected system error", category: "IT Incident Management" },
  { id: "inc-5", title: "Multiple users cannot access system", category: "IT Incident Management" },
  { id: "inc-6", title: "Critical production issue", category: "IT Incident Management" },

  // 3. IT In-House System Issue
  { id: "inh-1", title: "Internal system login problem", category: "IT In-House System Issue" },
  { id: "inh-2", title: "Page not loading in internal system", category: "IT In-House System Issue" },
  { id: "inh-3", title: "Feature not working in company system", category: "IT In-House System Issue" },
  { id: "inh-4", title: "Error when submitting form", category: "IT In-House System Issue" },
  { id: "inh-5", title: "System showing wrong data", category: "IT In-House System Issue" },
  { id: "inh-6", title: "Internal application crash", category: "IT In-House System Issue" },

  // 4. IT MIS & Analytics Issue
  { id: "mis-1", title: "Report not generating", category: "IT MIS & Analytics Issue" },
  { id: "mis-2", title: "Dashboard not loading", category: "IT MIS & Analytics Issue" },
  { id: "mis-3", title: "Incorrect data in report", category: "IT MIS & Analytics Issue" },
  { id: "mis-4", title: "Data sync issue", category: "IT MIS & Analytics Issue" },
  { id: "mis-5", title: "Export report failed (Excel/PDF)", category: "IT MIS & Analytics Issue" },
  { id: "mis-6", title: "Analytics dashboard error", category: "IT MIS & Analytics Issue" },

  // 5. IT Network Issue
  { id: "net-1", title: "No internet connection", category: "IT Network Issue" },
  { id: "net-2", title: "Slow internet speed", category: "IT Network Issue" },
  { id: "net-3", title: "Cannot connect to WiFi", category: "IT Network Issue" },
  { id: "net-4", title: "LAN cable connection problem", category: "IT Network Issue" },
  { id: "net-5", title: "VPN not connecting", category: "IT Network Issue" },
  { id: "net-6", title: "Network printer not reachable", category: "IT Network Issue" },
  { id: "net-7", title: "IP address conflict", category: "IT Network Issue" },

  // 6. IT Security Issue
  { id: "sec-1", title: "Suspicious email / phishing", category: "IT Security Issue" },
  { id: "sec-2", title: "Virus or malware detected", category: "IT Security Issue" },
  { id: "sec-3", title: "Unauthorized login attempt", category: "IT Security Issue" },
  { id: "sec-4", title: "Account locked due to security", category: "IT Security Issue" },
  { id: "sec-5", title: "Password compromised", category: "IT Security Issue" },
  { id: "sec-6", title: "Firewall blocking access", category: "IT Security Issue" },
  { id: "sec-7", title: "Security alert on system", category: "IT Security Issue" },

  // 7. IT Support Issue
  { id: "sup-1", title: "Computer not turning on", category: "IT Support Issue" },
  { id: "sup-2", title: "Keyboard or mouse not working", category: "IT Support Issue" },
  { id: "sup-3", title: "Printer or photocopy machine issue", category: "IT Support Issue" },
  { id: "sup-4", title: "Software installation request", category: "IT Support Issue" },
  { id: "sup-5", title: "Email not working", category: "IT Support Issue" },
  { id: "sup-6", title: "Monitor not displaying", category: "IT Support Issue" },
  { id: "sup-7", title: "Windows update problem", category: "IT Support Issue" },
  { id: "sup-8", title: "Laptop battery problem", category: "IT Support Issue" },

  // 8. IT System Issue
  { id: "sys-1", title: "Operating system error", category: "IT System Issue" },
  { id: "sys-2", title: "Software crash", category: "IT System Issue" },
  { id: "sys-3", title: "Application not opening", category: "IT System Issue" },
  { id: "sys-4", title: "System update failed", category: "IT System Issue" },
  { id: "sys-5", title: "System running very slow", category: "IT System Issue" },
  { id: "sys-6", title: "Blue screen error", category: "IT System Issue" },
  { id: "sys-7", title: "Driver missing or outdated", category: "IT System Issue" },
];
