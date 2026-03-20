import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:8080";

async function proxyRequest(req: NextRequest) {
  const url = new URL(req.url);
  // Forward the path after /api/v1/... to the backend
  const backendUrl = `${API_URL}${url.pathname}${url.search}`;

  const headers = new Headers(req.headers);
  // Remove host header so it doesn't conflict with the backend
  headers.delete("host");

  const init: RequestInit = {
    method: req.method,
    headers,
  };

  // Forward body for non-GET/HEAD requests
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.arrayBuffer();
  }

  try {
    const response = await fetch(backendUrl, init);
    const data = await response.arrayBuffer();

    const responseHeaders = new Headers(response.headers);
    // Remove headers that shouldn't be forwarded
    responseHeaders.delete("transfer-encoding");

    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Backend service unavailable" },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest) {
  return proxyRequest(req);
}
export async function POST(req: NextRequest) {
  return proxyRequest(req);
}
export async function PUT(req: NextRequest) {
  return proxyRequest(req);
}
export async function PATCH(req: NextRequest) {
  return proxyRequest(req);
}
export async function DELETE(req: NextRequest) {
  return proxyRequest(req);
}
