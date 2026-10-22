import test from "node:test";
import assert from "node:assert";
import { NextRequest } from "next/server";
import { DELETE, GET } from "./route";

test("proxy DELETE handler returns 204 with null body when backend responds with 204", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(null, {
      status: 204,
      statusText: "No Content",
      headers: {
        "transfer-encoding": "chunked",
      },
    });

  try {
    const req = new NextRequest("http://localhost:3000/api/v1/categories/109", {
      method: "DELETE",
    });
    const res = await DELETE(req);

    assert.strictEqual(res.status, 204);
    assert.strictEqual(res.body, null);
    assert.strictEqual(res.headers.get("transfer-encoding"), null);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("proxy GET handler returns 200 with body when backend responds with 200", async () => {
  const originalFetch = globalThis.fetch;
  const mockData = JSON.stringify([{ id: 1, name: "General" }]);
  globalThis.fetch = async () =>
    new Response(mockData, {
      status: 200,
      statusText: "OK",
      headers: {
        "content-type": "application/json",
      },
    });

  try {
    const req = new NextRequest("http://localhost:3000/api/v1/categories", {
      method: "GET",
    });
    const res = await GET(req);

    assert.strictEqual(res.status, 200);
    const text = await res.text();
    assert.strictEqual(text, mockData);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
