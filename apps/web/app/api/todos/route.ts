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

import { NextRequest, NextResponse } from "next/server";
import axios from "../../../config/axios";
import { ToDo } from "@repo/types/ToDo";

interface RateLimitWindow {
  timestamps: number[];
  lastCleanup: number;
}

const rateLimit = new Map<string, RateLimitWindow>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Max requests per window

// Rate limiting middleware
const withRateLimit = (
  handler: (request: NextRequest) => Promise<NextResponse>
) => {
  return async (request: NextRequest): Promise<NextResponse> => {
    const ip =
      request.ip || request.headers.get("x-forwarded-for") || "127.0.0.1";
    const now = Date.now();

    let window = rateLimit.get(ip);
    if (!window) {
      window = { timestamps: [], lastCleanup: now };
      rateLimit.set(ip, window);
    }

    // Clean up old timestamps
    if (now - window.lastCleanup > WINDOW_MS) {
      window.timestamps = window.timestamps.filter(
        (timestamp) => timestamp > now - WINDOW_MS
      );
      window.lastCleanup = now;
    }

    if (window.timestamps.length >= MAX_REQUESTS) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    window.timestamps.push(now);

    return handler(request);
  };
};

// Cache implementation
interface CacheEntry {
  data: ReadonlyArray<ToDo>;
  timestamp: number;
}

const cache: CacheEntry = {
  data: [],
  timestamp: 0,
};

const CACHE_TTL = 60 * 1000; // 1 minute cache TTL

export const GET = withRateLimit(async () => {
  const now = Date.now();

  // Check if cache is valid
  if (now - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const { data } = await axios.get<{ data: ReadonlyArray<ToDo> }>(
      "/todos?limit=20"
    );

    // Update cache
    cache.data = data.data;
    cache.timestamp = now;

    return NextResponse.json(data.data);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
});

export const POST = withRateLimit(async (request: NextRequest) => {
  try {
    const newTodo = await request.json();
    const { data } = await axios.post<ToDo>("/todos", newTodo);
    invalidateCache();
    return NextResponse.json({ todo: data }, { status: 201 });
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
});

export const PUT = withRateLimit(async (request: NextRequest) => {
  try {
    const { id, ...updateData } = await request.json();
    const { data } = await axios.put<ToDo>(`/todos/${id}`, updateData);
    invalidateCache();
    return NextResponse.json({ todo: data }, { status: 200 });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
});

export const DELETE = withRateLimit(async (request: NextRequest) => {
  try {
    const { id } = await request.json();
    await axios.delete(`/todos/${id}`);
    invalidateCache();
    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
});

const invalidateCache = () => {
  cache.timestamp = 0;
};
