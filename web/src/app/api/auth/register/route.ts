import { NextResponse } from "next/server";
import { extractApiErrorMessage } from "@/lib/api-error";
import { API_URL } from "@/lib/config";
import { setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { message: extractApiErrorMessage(data, "Registration failed") },
      { status: response.status },
    );
  }

  await setSessionCookie(data.accessToken);
  return NextResponse.json({ ok: true });
}
