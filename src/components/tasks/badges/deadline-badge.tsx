import React from "react";
import { CgSandClock } from "react-icons/cg";

export interface DeadlineBadgeProps {
  deadline: Date;
}
export default function DeadlineBadge(props: DeadlineBadgeProps) {
  return (
    <span className="flex items-center justify-start gap-2 px-2 py-1 text-orange-800 bg-orange-100 rounded ">
      <CgSandClock />
      Deadline {new Date(props.deadline).toLocaleDateString("en-US")}
    </span>
  );
}
