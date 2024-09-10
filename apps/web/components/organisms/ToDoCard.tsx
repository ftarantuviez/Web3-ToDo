"use client";
import React from "react";
import { CheckIcon, Pencil1Icon } from "@radix-ui/react-icons";

import { FadeInScaleAnimation } from "@ui/components/FadeInScaleAnimation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/Card";
import { Button } from "@ui/components/Button";
import type { ToDo } from "@repo/types/ToDo";
import { Chip } from "@ui/components/Chip";
import { TrashIcon } from "lucide-react";

export const ToDoCard: React.FC<
  Readonly<{
    title: string;
    description: string;
    dueDate: Date;
    severity: ToDo["priority"];
    completed: boolean;
    onComplete: () => void;
    onEdit: () => void;
    onDelete: () => void;
  }>
> = ({
  title,
  description,
  dueDate,
  severity,
  completed,
  onComplete,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className={`w-full max-w-md shadow ${completed ? "opacity-50" : ""}`}>
      <FadeInScaleAnimation duration="1.2">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {title}
            <div className="flex items-center gap-2">
              <Chip
                status={getChipStatusByPriority(severity)}
                text={severity}
              />
              {completed && <Chip status="success" text="Completed" />}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{description}</p>
          <p className="text-sm text-gray-500 mt-2">
            Due: {new Date(dueDate).toLocaleDateString()}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={onComplete} className="gap-3" disabled={completed}>
            <CheckIcon className="size-5" />
            {completed ? "Completed" : "Complete"}
          </Button>

          <Button
            variant="outline"
            onClick={onEdit}
            className="gap-3"
            disabled={completed}
          >
            <Pencil1Icon className="size-3.5" />
            Edit
          </Button>
          <Button variant="outline" size="icon" onClick={onDelete}>
            <TrashIcon className="size-3.5" />
          </Button>
        </CardFooter>
      </FadeInScaleAnimation>
    </Card>
  );
};

/**
 * Get the status of the chip based on the priority.
 *
 * @param priority The priority of the ToDo item.
 * @returns The status of the chip.
 */
const getChipStatusByPriority = (priority: ToDo["priority"]) => {
  switch (priority) {
    case "low":
      return "warning";
    case "medium":
      return "info";
    case "high":
      return "error";
    default:
      return "success";
  }
};
