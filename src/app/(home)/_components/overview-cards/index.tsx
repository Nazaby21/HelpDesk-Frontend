import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";

export async function OverviewCardsGroup() {
  const { tickets, pendingTickets, completedTickets, users } = await getOverviewData();

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Total Ticket"
        data={{
          ...tickets,
          value: compactFormat(tickets.value),
        }}
        Icon={icons.Views}
      />

      <OverviewCard
        label="Total Pending Ticket"
        data={{
          ...pendingTickets,
          value: compactFormat(pendingTickets.value),
        }}
        Icon={icons.Profit}
      />

      <OverviewCard
        label="Total Completed Ticket"
        data={{
          ...completedTickets,
          value: compactFormat(completedTickets.value),
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="Total Users"
        data={{
          ...users,
          value: compactFormat(users.value),
        }}
        Icon={icons.Users}
      />
    </div>
  );
}
