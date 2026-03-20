"use client";

import React from "react";
import { compactFormat } from "@/lib/format-number";
import { OverviewCard } from "./card";
import { OverviewCardsSkeleton } from "./skeleton";
import * as icons from "./icons";
import { useGetDashboardStatsQuery } from "@/redux/feature/ticket/ticketApi";
import { useRole } from "@/app/role-context";

export function OverviewCardsGroup() {
  const { data: stats, isLoading } = useGetDashboardStatsQuery();
  const { role } = useRole();

  if (isLoading || !stats) {
    return <OverviewCardsSkeleton />;
  }

  const showUsers = role !== "technician";

  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 ${showUsers ? "xl:grid-cols-4" : "xl:grid-cols-3"} 2xl:gap-7.5`}>
      <OverviewCard
        label="Total Tickets"
        data={{ value: compactFormat(stats.totalTickets) }}
        Icon={icons.Views}
      />

      <OverviewCard
        label="Pending Tickets"
        data={{ value: compactFormat(stats.pendingTickets) }}
        Icon={icons.Profit}
      />

      <OverviewCard
        label="Completed Tickets"
        data={{ value: compactFormat(stats.completedTickets) }}
        Icon={icons.Product}
      />

      {showUsers && (
        <OverviewCard
          label="Total Users"
          data={{ value: compactFormat(stats.totalUsers) }}
          Icon={icons.Users}
        />
      )}
    </div>
  );
}
