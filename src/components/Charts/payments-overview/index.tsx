"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useGetTicketsQuery, useGetTicketHistoryQuery, useGetDashboardStatsQuery } from "@/redux/feature/ticket/ticketApi";
import { PaymentsOverviewChart } from "./chart";

type PropsType = {
  className?: string;
};

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function PaymentsOverview({ className }: PropsType) {
  const { data: activeTickets = [], isLoading: loadingActive } = useGetTicketsQuery();
  const { data: historyTickets = [], isLoading: loadingHistory } = useGetTicketHistoryQuery();
  const { data: stats, isLoading: loadingStats } = useGetDashboardStatsQuery();

  const isLoading = loadingActive || loadingHistory || loadingStats;

  const data = useMemo(() => {
    const completedByMonth = new Array(12).fill(0);
    const pendingByMonth = new Array(12).fill(0);

    // Active tickets (PENDING + IN_PROGRESS)
    activeTickets.forEach((t) => {
      if (!t.createdAt) return;
      const month = new Date(t.createdAt).getMonth();
      pendingByMonth[month]++;
    });

    // History tickets (COMPLETED)
    historyTickets.forEach((t) => {
      if (!t.createdAt) return;
      const month = new Date(t.createdAt).getMonth();
      completedByMonth[month]++;
    });

    return {
      received: MONTH_LABELS.map((label, i) => ({ x: label, y: completedByMonth[i] })),
      due: MONTH_LABELS.map((label, i) => ({ x: label, y: pendingByMonth[i] })),
    };
  }, [activeTickets, historyTickets]);

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
