/**
 * @fileoverview This file contains the API route handlers for the todos endpoint.
 * It serves as a middleware between the frontend and the backend API,
 * handling CRUD operations for todo items.
 *
 * The route handlers interact with an external API using axios,
 * transforming requests from the Next.js API routes to the format
 * expected by the backend, and vice versa for responses.
 *
 * Operations include:
 * - GET: Fetching todos
 * - POST: Creating a new todo
 * - PUT: Updating an existing todo
 * - DELETE: Removing a todo (implementation not shown in this snippet)
 *
 * Error handling is implemented to catch and report any issues
 * that occur during these operations.
 */

import { NextResponse } from "next/server";
import axios from "../../../config/axios";
import { ToDo } from "@repo/types/ToDo";

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
    const newTodo = await request.json();

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
