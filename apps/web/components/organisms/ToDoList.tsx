"use client";
import React, { useCallback, useMemo, useState } from "react";
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
import { useToDo } from "../../contexts/ToDoProvider";
import { FadeInScaleAnimation } from "../../../../packages/ui/src/components/FadeInScaleAnimation";

export const ToDoList: React.FunctionComponent = () => {
  const { todos, markAsCompleted, deleteToDo } = useToDo();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<"all" | ToDo["priority"]>("all");

  // We filter the data based on the selected filter.
  const itemsToDisplay = useMemo(() => {
    if (filter === "all") {
      return todos;
    }

    return todos.filter((item) => item.priority === filter);
  }, [todos, filter]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-4xl font-bold ">To-Do List</h1>
          <Button
            onClick={() => setIsOpen(true)}
            className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:rotate-1 animate-pulse"
            size="lg"
          >
            <PlusIcon className="w-6 h-6" />
            <span className="font-bold">New Task</span>
          </Button>
        </div>
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
        {itemsToDisplay.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <FadeInScaleAnimation duration="0.75">
              <p className="text-gray-500 text-lg">No tasks to display.</p>
              <p className="text-gray-400">Add a new task to get started!</p>
            </FadeInScaleAnimation>
          </div>
        ) : (
          itemsToDisplay.map((todo) => (
            <ToDoCard
              title={todo.title}
              description={todo.description}
              dueDate={todo.dueDate}
              severity={todo.priority}
              onComplete={() => markAsCompleted(todo.id)}
              onDelete={() => deleteToDo(todo.id)}
              onEdit={() => console.log("Edit Buy groceries")}
              key={todo.id}
              completed={todo.completed}
            />
          ))
        )}
      </div>
      <ToDoModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};
