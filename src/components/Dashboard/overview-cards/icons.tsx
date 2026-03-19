import { Ticket, Clock, CheckCircle2, Users as UsersIcon } from "lucide-react";
import type { SVGProps } from "react";

type SVGPropsType = SVGProps<SVGSVGElement>;

export function Views(props: SVGPropsType) {
  return (
    <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#18BFFF]/10 dark:bg-[#18BFFF]/20">
      <Ticket className="h-7 w-7 text-[#18BFFF] dark:text-[#18BFFF]" />
    </div>
  );
}

export function Profit(props: SVGPropsType) {
  return (
    <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#FF9C55]/10 dark:bg-[#FF9C55]/20">
      <Clock className="h-7 w-7 text-[#FF9C55] dark:text-[#FF9C55]" />
    </div>
  );
}

export function Product(props: SVGPropsType) {
  return (
    <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#3FD97F]/10 dark:bg-[#3FD97F]/20">
      <CheckCircle2 className="h-7 w-7 text-[#3FD97F] dark:text-[#3FD97F]" />
    </div>
  );
}

export function Users(props: SVGPropsType) {
  return (
    <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#8155FF]/10 dark:bg-[#8155FF]/20">
      <UsersIcon className="h-7 w-7 text-[#8155FF] dark:text-[#8155FF]" />
    </div>
  );
}
