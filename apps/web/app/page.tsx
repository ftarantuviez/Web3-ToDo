import type { ToDo } from "@repo/types/ToDo";
import axios from "axios";
import { NavBar } from "../components/ui/NavBar";
import { ToDoList } from "../components/todo/ToDoList";
import { MintCard } from "../components/web3/MintCard";

export default async function Home() {
  // We get Server-Side Props to fetch the data from the API.
  const { data } = await axios.get<Readonly<{ data: ReadonlyArray<ToDo> }>>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/todos?page=1&limit=10`
  );

  return (
    <>
      <NavBar />
      <div className="h-screen w-screen px-20 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div className="lg:col-span-4">
            <ToDoList data={data.data} />
          </div>
          <div className="md:col-span-1">
            <MintCard completedTodos={1} />
          </div>
        </div>
      </div>
    </>
  );
}
