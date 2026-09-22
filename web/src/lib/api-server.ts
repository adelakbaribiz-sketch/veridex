import "server-only";
import { API_URL } from "@/lib/config";
import { getSessionToken } from "@/lib/session";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function serverFetch<T>(path: string): Promise<T | null> {
  const token = await getSessionToken();
  if (!token) return null;

  const response = await fetch(`${API_URL}/api/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (response.status === 401) return null;
  if (!response.ok) {
    throw new ApiError(response.status, `Request to ${path} failed (${response.status})`);
  }

  return (await response.json()) as T;
}
