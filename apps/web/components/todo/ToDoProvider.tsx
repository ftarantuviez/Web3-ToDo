"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { ToDo } from "@repo/types/ToDo";
import { toast } from "@ui/components/Toaster";
import axios from "axios";

/**
 * Represents a partial ToDo item without 'id' and 'completed' fields.
 * Useful for creating and updating a todo.
 */
export type PartialToDo = Omit<ToDo, "id" | "completed">;

type ToDoContextType = Readonly<{
  /** An array of ToDo items */
  todos: ReadonlyArray<ToDo>;

  /**
   * Creates a new ToDo item
   * @param todo The partial ToDo item to create
   */
  createToDo: (todo: PartialToDo) => Promise<ToDo | undefined>;

  /**
   * Updates an existing ToDo item
   * @param id The ID of the ToDo item to update
   * @param todo The partial ToDo item with updated fields
   */
  updateToDo: (id: string, todo: PartialToDo) => Promise<ToDo | undefined>;

  /**
   * Deletes a ToDo item
   * @param id The ID of the ToDo item to delete
   */
  deleteToDo: (id: string) => Promise<boolean | undefined>;

  /**
   * Marks a ToDo item as completed
   * @param id The ID of the ToDo item to mark as completed
   */
  markAsCompleted: (id: string) => Promise<ToDo | undefined>;

  /** Indicates whether the ToDo items are currently being loaded */
  loading: boolean;
}>;

const ToDoContext = createContext<ToDoContextType>({
  todos: [],
  loading: false,
  createToDo: async () => undefined,
  updateToDo: async () => undefined,
  deleteToDo: async () => undefined,
  markAsCompleted: async () => undefined,
});

export const ToDoProvider: React.FC<
  Readonly<{
    children: ReactNode;
    todos: ReadonlyArray<ToDo>;
  }>
> = ({ children, todos: fetchedToDos }) => {
  const [todos, setTodos] = useState<ReadonlyArray<ToDo>>([]);
  const [loading, setLoading] = useState(true);

  const getToDos = useCallback(async () => {
    try {
      const { data } = await axios.get<ReadonlyArray<ToDo>>("/api/todos");
      setTodos(data);
      setLoading(false);
    } catch (err) {
      toastError();
      console.error("Error fetching todos:", err);
    }
  }, []);

  const createToDo = useCallback(
    async (todo: PartialToDo) => {
      try {
        const { data } = await axios.post<{ todo: ToDo }>("/api/todos", todo);
        getToDos();

        toast.success("Todo created successfully");

        return data.todo;
      } catch (err) {
        toastError();
        console.error("Error creating todo:", err);
      }
    },
    [getToDos]
  );

  const updateToDo = useCallback(
    async (id: string, updatedTodo: Partial<ToDo>) => {
      try {
        const selectedTodo = todos.find((todo) => todo.id === id);
        // This is a safety check to ensure that the todo exists
        if (!selectedTodo) {
          throw new Error("Todo not found");
        }

        const { data } = await axios.put<{ todo: ToDo }>(`/api/todos`, {
          ...selectedTodo,
          ...updatedTodo,
        });

        getToDos();

        toast.success("Todo updated successfully");
        return data.todo;
      } catch (err) {
        toastError();
        console.error("Error updating todo:", err);
      }
    },
    [todos, getToDos]
  );

  const deleteToDo = useCallback(
    async (id: string) => {
      try {
        await axios.delete(`/api/todos`, { data: { id } });
        toast.success("Todo deleted successfully");
        getToDos();
        return true;
      } catch (err) {
        toastError();
        console.error("Error deleting todo:", err);
      }
    },
    [getToDos]
  );

  const markAsCompleted = useCallback(
    async (id: string) => {
      return await updateToDo(id, { completed: true });
    },
    [updateToDo]
  );

  useEffect(() => {
    // We set the todos to the data fetched from the server
    setTodos(fetchedToDos);
  }, [fetchedToDos]);

  // We sort the todos based on their completion status
  const sortedTodos = useMemo(() => {
    return [
      ...todos.filter((todo) => !todo.completed),
      ...todos.filter((todo) => todo.completed),
    ];
  }, [todos]);

  return (
    <ToDoContext.Provider
      value={{
        todos: sortedTodos,
        loading,
        createToDo,
        updateToDo,
        deleteToDo,
        markAsCompleted,
      }}
    >
      {children}
    </ToDoContext.Provider>
  );
};

export const useToDo = () => {
  const context = useContext(ToDoContext);
  if (!context) {
    throw new Error("useToDo must be used within a ToDoProvider");
  }
  return context;
};

const toastError = () => {
  return toast.error(
    "Failed to perform operation. Please check your network connection and try again.",
    {
      duration: 5000,
      icon: "🚫",
    }
  );
};
