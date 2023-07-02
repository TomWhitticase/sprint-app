import { TaskStatus } from "@prisma/client";
import React from "react";

export interface StatusBadgeProps {
  status: TaskStatus;
}
export default function StatusBadge({ status }: StatusBadgeProps) {
  const label =
    status === "TODO"
      ? "To-Do"
      : status === "INPROGRESS"
      ? "In-Progress"
      : status === "REVIEW"
      ? "Review"
      : status === "COMPLETED"
      ? "Completed"
      : "Unknown";

  const statusClassNames =
    status === "TODO"
      ? "bg-todo-red text-todo-red-text"
      : status === "INPROGRESS"
      ? "bg-in-progress-blue text-in-progress-blue-text"
      : status === "REVIEW"
      ? "bg-review-amber text-review-amber-text"
      : status === "COMPLETED"
      ? "bg-completed-green text-completed-green-text"
      : "bg-gray-400 text-gray-400-text";

  return (
    <div
      className={`p-1 uppercase font-bold px-2 text-sm rounded ${statusClassNames}`}
    >
      {label}
    </div>
  );
}
