import { TaskPriority } from "@prisma/client";
import React from "react";
export interface PriorityBadgeProps {
  priority: TaskPriority;
}
export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const label =
    priority === "LOW"
      ? "Low"
      : priority === "MEDIUM"
      ? "Medium"
      : priority === "HIGH"
      ? "High"
      : "Unknown";
  const priorityClassNames =
    priority === "LOW"
      ? "text-green-500"
      : priority === "MEDIUM"
      ? "text-amber-500"
      : priority === "HIGH"
      ? "text-red-500"
      : "text-gray-400";
  return (
    <div
      className={`p-1 uppercase font-bold px-2 text-sm rounded ${priorityClassNames}`}
    >
      {label}
    </div>
  );
}
