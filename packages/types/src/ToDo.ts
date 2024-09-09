/**
 * Base structure for a ToDo item
 *
 * @property id - The unique identifier for the ToDo item
 * @property title - The title of the ToDo item
 * @property description - The description of the ToDo item
 * @property dueDate - The due date of the ToDo item
 * @property priority - The priority of the ToDo item
 * @property completed - Whether the ToDo item is completed or not
 *
 */
export type ToDo = Readonly<{
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  completed: boolean;
}>;
