import { SERVER_API_BASE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";

function buildTargetUrl(request, pathParts) {
  const incomingUrl = new URL(request.url);
  const base = SERVER_API_BASE_URL.replace(/\/+$/, "");
  const path = pathParts.map(encodeURIComponent).join("/");
  return `${base}/${path}${incomingUrl.search}`;
}

async function proxyRequest(request, context) {
  if (!SERVER_API_BASE_URL) {
    return Response.json(
      { message: "API base URL is not configured. Set NEXT_PUBLIC_API_URL in .env.local." },
      { status: 500 }
    );
  }

  const { path = [] } = await context.params;
  const targetUrl = buildTargetUrl(request, path);
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  headers.delete("cookie");
  headers.delete("origin");
  headers.delete("referer");
  headers.delete("x-csrf-token");
  headers.delete("x-xsrf-token");
  headers.set("accept", "application/json");

  let response;
  try {
    response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer(),
      redirect: "manual",
    });
  } catch (error) {
    return Response.json(
      {
        message: `Failed to reach Laravel API at ${targetUrl}. Make sure http://localhost:8000 is running.`,
        error: error.message,
      },
      { status: 502 }
    );
  }

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export function GET(request, context) {
  return proxyRequest(request, context);
}

export function POST(request, context) {
  return proxyRequest(request, context);
}

export function PUT(request, context) {
  return proxyRequest(request, context);
}

export function PATCH(request, context) {
  return proxyRequest(request, context);
}

export function DELETE(request, context) {
  return proxyRequest(request, context);
}
