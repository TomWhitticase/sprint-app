import React from "react";
import { FaRegClock } from "react-icons/fa";

interface DeadlineBadgeProps {
  deadline: Date;
}

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const calculateDaysLeft = (deadline: Date) => {
  const now = new Date();
  const diff = new Date(deadline).getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export default function DeadlineBadge({ deadline }: DeadlineBadgeProps) {
  const daysLeft = calculateDaysLeft(deadline);
  const scale = 1 - Math.min(1, daysLeft / 10); // Assuming that 10 days is the maximum for the lighter color

  const colorStart = hexToRgb("#E5DC90");
  const colorEnd = hexToRgb("#FF6B00");

  if (!colorStart || !colorEnd) return null;

  const r = Math.round(colorStart.r + scale * (colorEnd.r - colorStart.r));
  const g = Math.round(colorStart.g + scale * (colorEnd.g - colorStart.g));
  const b = Math.round(colorStart.b + scale * (colorEnd.b - colorStart.b));

  const color = rgbToHex(r, g, b);

  const textColor =
    r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF"; // Contrast calculation for text color

  return (
    <span
      className="flex items-center justify-start gap-1 px-2 py-1 rounded"
      style={{ backgroundColor: color, color: textColor }}
    >
      <FaRegClock />
      {new Date(deadline).toLocaleDateString("en-US")}
    </span>
  );
}
