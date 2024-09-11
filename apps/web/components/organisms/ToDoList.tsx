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
  const [editToDo, setEditToDo] = useState<ToDo | undefined>(undefined);

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
          {todos.length > 0 && (
            <Button
              onClick={() => setIsOpen(true)}
              className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:rotate-1 animate-pulse dark:from-purple-700 dark:to-pink-700 dark:hover:from-purple-800 dark:hover:to-pink-800 ml-4"
              size="lg"
            >
              <PlusIcon className="w-6 h-6" />
              <span className="font-bold">New Task</span>
            </Button>
          )}
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
              <div className="space-y-4">
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 dark:from-purple-300 dark:to-pink-500">
                  Your task list is empty!
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Time to add some exciting tasks and boost your productivity.
                </p>
                <div className="flex items-center justify-center">
                  <span className="animate-bounce text-3xl mr-2">👇</span>
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    Click the "New Task" button to get started!
                  </p>
                </div>
                <Button
                  onClick={() => setIsOpen(true)}
                  className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:rotate-1 animate-pulse dark:from-purple-700 dark:to-pink-700 dark:hover:from-purple-800 dark:hover:to-pink-800 ml-4"
                  size="lg"
                >
                  <PlusIcon className="w-6 h-6" />
                  <span className="font-bold">New Task</span>
                </Button>
              </div>
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
              onEdit={() => {
                setEditToDo(todo);
                setIsOpen(true);
              }}
              key={todo.id}
              completed={todo.completed}
            />
          ))
        )}
      </div>
      <ToDoModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        toDo={editToDo}
      />
    </div>
  );
};
