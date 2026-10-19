"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useGetMonthlyStatsQuery, useGetDashboardStatsQuery } from "@/redux/feature/ticket/ticketApi";
import { PaymentsOverviewChart } from "./chart";

type PropsType = {
  className?: string;
};

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function PaymentsOverview({ className }: PropsType) {
  const currentYear = new Date().getFullYear();
  const { data: monthlyStats, isLoading: loadingMonthly } = useGetMonthlyStatsQuery({ year: currentYear });
  const { data: stats, isLoading: loadingStats } = useGetDashboardStatsQuery();

  const isLoading = loadingMonthly || loadingStats;

  const data = useMemo(() => {
    return {
      received: MONTH_LABELS.map((label, i) => ({ x: label, y: monthlyStats?.received?.[i] || 0 })),
      due: MONTH_LABELS.map((label, i) => ({ x: label, y: monthlyStats?.due?.[i] || 0 })),
    };
  }, [monthlyStats]);

  if (isLoading) {
    return (
      <div className={cn("rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark", className)}>
        <p className="text-gray-500">Loading chart...</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Ticket Overview
        </h2>
      </div>

      <PaymentsOverviewChart data={data} />

      <dl className="grid divide-stroke text-center dark:divide-dark-3 sm:grid-cols-2 sm:divide-x [&>div]:flex [&>div]:flex-col-reverse [&>div]:gap-1">
        <div className="dark:border-dark-3 max-sm:mb-3 max-sm:border-b max-sm:pb-3">
          <dt className="text-xl font-bold text-dark dark:text-white">
            {stats?.completedTickets ?? 0}
          </dt>
          <dd className="font-medium dark:text-dark-6">Completed Tickets</dd>
        </div>

        <div>
          <dt className="text-xl font-bold text-dark dark:text-white">
            {stats?.pendingTickets ?? 0}
          </dt>
          <dd className="font-medium dark:text-dark-6">Pending Tickets</dd>
        </div>
      </dl>
    </div>
  );
}
