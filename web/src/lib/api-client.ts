"use client";

import { extractApiErrorMessage } from "@/lib/api-error";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/proxy/${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  const isJson = response.headers.get("Content-Type")?.includes("application/json");
  const body = isJson ? await response.json() : undefined;

  if (!response.ok) {
    throw new Error(extractApiErrorMessage(body, `Request failed (${response.status})`));
  }

  return body as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "POST", body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PATCH", body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
