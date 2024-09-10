import { NextResponse } from "next/server";
import axios from "../../../config/axios";
import { ToDo } from "@repo/types/ToDo";
import { PartialToDo } from "../../../components/todo/ToDoProvider";

export async function GET() {
  try {
    const { data } = await axios.get<{ data: ReadonlyArray<ToDo> }>(
      "/todos?limit=20"
    );

    return NextResponse.json(data.data);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newTodo: PartialToDo = await request.json();

    const { data } = await axios.post<ToDo>("/todos", newTodo);

    return NextResponse.json({ todo: data }, { status: 201 });
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json();
    const { data } = await axios.put<ToDo>(`/todos/${id}`, updateData);

    return NextResponse.json({ todo: data }, { status: 200 });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { data } = await axios.delete(`/todos/${id}`);

    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
