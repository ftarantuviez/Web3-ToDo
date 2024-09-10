import type { ToDo } from "@repo/types/ToDo";

import axios from "../config/axios";

import { Home } from "../components/pages/Home";
import { ToDoProvider } from "../contexts/ToDoProvider";

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
