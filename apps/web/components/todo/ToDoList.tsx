"use client";
import React, { useMemo, useState } from "react";
import { ToDoCard } from "./ToDoCard";

import { Button } from "@ui/components/Button";
import { Separator } from "@ui/components/Separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/Select";

import { ToDoModal } from "./ToDoModal";
import { Chip } from "@ui/components/Chip";
import type { ToDo } from "@repo/types/ToDo";
import { PlusIcon } from "@radix-ui/react-icons";

export const ToDoList: React.FunctionComponent<
  Readonly<{ data: ReadonlyArray<ToDo> }>
> = ({ data }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<"all" | ToDo["priority"]>("all");

  // We filter the data based on the selected filter.
  const itemsToDisplay = useMemo(() => {
    if (filter === "all") {
      return data;
    }

    return data.filter((item) => item.priority === filter);
  }, [data, filter]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold mb-4">To-Do List</h1>
        <Select
          onValueChange={(value) =>
            setFilter(value as "all" | ToDo["priority"])
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="low">
              <Chip status="success" text="Low" />
            </SelectItem>
            <SelectItem value="medium">
              <Chip status="warning" text="Medium" />
            </SelectItem>
            <SelectItem value="high">
              <Chip status="error" text="High" />
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator className="my-5" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
        {itemsToDisplay.map((todo) => (
          <ToDoCard
            title={todo.title}
            description={todo.description}
            dueDate={todo.dueDate}
            severity={todo.priority}
            onComplete={() => console.log("Completed Buy groceries")}
            onEdit={() => console.log("Edit Buy groceries")}
            key={todo.id}
          />
        ))}
      </div>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:rotate-1 animate-pulse"
        size="lg"
      >
        <PlusIcon className="w-6 h-6" />
        <span className="font-bold">New Task</span>
      </Button>
      <ToDoModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};
