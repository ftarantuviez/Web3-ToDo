import type { ToDo } from "@repo/types/ToDo";

import axios from "../config/axios";
import { ToDoProvider } from "../components/todo/ToDoProvider";
import { Home } from "../components/todo/Home";

export default async function HomePage() {
  // We get Server-Side Props to fetch the data from the API.
  const { data } = await axios.get<Readonly<{ data: ReadonlyArray<ToDo> }>>(
    "/todos?page=1&limit=20"
  );

  return (
    <ToDoProvider todos={data.data}>
      <Home />
    </ToDoProvider>
  );
}
