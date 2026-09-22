import { NextResponse } from "next/server";
import { API_URL } from "@/lib/config";
import { getSessionToken } from "@/lib/session";

type RouteParams = { params: Promise<{ path: string[] }> };

async function forward(request: Request, { params }: RouteParams) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { path } = await params;
  const search = new URL(request.url).search;
  const targetUrl = `${API_URL}/api/${path.join("/")}${search}`;

  const hasBody = request.method !== "GET" && request.method !== "DELETE";
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
    },
    body: hasBody ? await request.text() : undefined,
  });

  const text = await response.text();
  return new NextResponse(text, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
  });
}

export { forward as GET, forward as POST, forward as PATCH, forward as DELETE };
