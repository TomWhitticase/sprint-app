import React from "react";
import { BiComment } from "react-icons/bi";

export interface CommentBadgeProps {
  count: number;
}
export default function CommentBadge({ count }: CommentBadgeProps) {
  return (
    <div className="flex items-center justify-center gap-2 px-2 py-1 transition-all duration-300 ease-in-out rounded text-slate-500 bg-slate-100">
      <BiComment />
      <span> {count}</span>
      Comment
      {count !== 1 && "s"}
    </div>
  );
}
