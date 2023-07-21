import React from "react";
import { FaRegClock } from "react-icons/fa";

interface DeadlineBadgeProps {
  deadline: Date;
  completed?: boolean;
}

const calculateDaysLeft = (deadline: Date) => {
  const now = new Date();
  const diff = new Date(deadline).getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export default function DeadlineBadge({
  deadline,
  completed,
}: DeadlineBadgeProps) {
  const daysLeft = calculateDaysLeft(deadline);

  if (completed) {
    return (
      <div className="flex items-center justify-center gap-2 px-2 py-[0.15rem] text-xs border-2 rounded border-slate-200 text-slate-400 bg-slate-100">
        <FaRegClock />
        {new Date(deadline).toLocaleDateString("en-UK")}
      </div>
    );
  }

  if (daysLeft === 0) {
    return (
      <div className="flex items-center justify-center gap-2 text-xs px-2 py-[0.15rem] border-2 rounded text-amber-400 border-amber-200 bg-amber-100">
        <FaRegClock />
        {new Date(deadline).toLocaleDateString("en-UK")}
      </div>
    );
  }
  if (daysLeft < 0)
    return (
      <div className="flex items-center justify-center gap-2 px-2 py-[0.15rem] text-xs text-red-400 border-2 border-red-200 bg-red-100 rounded">
        <FaRegClock />
        {new Date(deadline).toLocaleDateString("en-UK")}
      </div>
    );

  return (
    <div className="flex items-center justify-center gap-2 px-2 py-[0.15rem] text-xs border-indigo-200 border-2 rounded bg-indigo-100 text-indigo-400">
      <FaRegClock />
      {new Date(deadline).toLocaleDateString("en-UK")}
    </div>
  );
}
