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

export const ToDoCard: React.FC<
  Readonly<{
    title: string;
    description: string;
    dueDate: Date;
    severity: ToDo["priority"];
    onComplete: () => void;
    onEdit: () => void;
  }>
> = ({ title, description, dueDate, severity, onComplete, onEdit }) => {
  return (
    <Card className="w-full max-w-md shadow">
      <FadeInScaleAnimation duration="1.2">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {title}
            <Chip status={getChipStatusByPriority(severity)} text={severity} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{description}</p>
          <p className="text-sm text-gray-500 mt-2">
            Due: {new Date(dueDate).getDay()}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={onComplete} className="gap-3">
            <CheckIcon className="size-5" />
            Complete
          </Button>
          <Button variant="outline" onClick={onEdit} className="gap-3">
            <Pencil1Icon className="size-3.5" />
            Edit
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
