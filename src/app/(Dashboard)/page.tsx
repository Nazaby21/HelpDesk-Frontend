"use client";

import { PaymentsOverview } from "@/components/Charts/payments-overview";
import { OverviewCardsGroup } from "@/components/Dashboard/overview-cards";

export default function Home() {
  return (
    <>
      <OverviewCardsGroup />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <PaymentsOverview className="col-span-12 xl:col-span-12" />
      </div>
    </>
  );
}
