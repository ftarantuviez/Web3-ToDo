import React from "react";
import { cn } from "../lib/utils";

export type ChipStatus = "info" | "success" | "warning" | "error";

/**
 * A small rounded pill to display a status or category.
 * @param children The content of the chip.
 * @param status The status of the chip.
 * @returns A styled pill component.
 *
 * @example
 * ```tsx
 * <Chip status="success">Completed</Chip>
 * ```
 */
export const Chip: React.FC<
  Readonly<{
    text: string;
    status?: ChipStatus;
  }>
> = ({ text, status = "info" }) => {
  const statusClasses: Record<ChipStatus, string> = {
    info: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        statusClasses[status]
      )}
    >
      {text}
    </span>
  );
};
