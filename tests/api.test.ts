import { describe, it, expect } from "vitest";
import { POST } from "../app/api/check/route";
import { GET } from "../app/api/check/[id]/route";
import { NextRequest } from "next/server";

describe("Phase 7 — Streaming SSE API & Saved Check Retrieval", () => {
  it("rejects empty text with 400 status", async () => {
    const req = new NextRequest("http://localhost:3000/api/check", {
      method: "POST",
      body: JSON.stringify({ text: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("streams SSE events and completes with done event", async () => {
    const testText = "Python 3.8 is the latest release.";
    const req = new NextRequest("http://localhost:3000/api/check", {
      method: "POST",
      body: JSON.stringify({ text: testText }),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/event-stream");

    const reader = response.body?.getReader();
    expect(reader).toBeDefined();

    let fullStreamText = "";
    const decoder = new TextDecoder();

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullStreamText += decoder.decode(value);
      }
    }

    // Verify SSE protocol events
    expect(fullStreamText).toContain("event: claims_extracted");
    expect(fullStreamText).toContain("event: claim_verified");
    expect(fullStreamText).toContain("event: done");
  });

  it("truth-checks static factual statements instead of skipping them (no false 100)", async () => {
    const req = new NextRequest("http://localhost:3000/api/check", {
      method: "POST",
      body: JSON.stringify({ text: "Earth is flat." }),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    const reader = response.body?.getReader();
    let fullStreamText = "";
    const decoder = new TextDecoder();

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullStreamText += decoder.decode(value);
      }
    }

    expect(fullStreamText).toContain("event: done");
    expect(fullStreamText).toContain('"verification_mode":"truth"');
    expect(fullStreamText).not.toContain('"overallScore":100');
  });

  it("returns a null overall score when only opinions/instructions are detected", async () => {
    const req = new NextRequest("http://localhost:3000/api/check", {
      method: "POST",
      body: JSON.stringify({ text: "React is the best framework for building apps." }),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    const reader = response.body?.getReader();
    let fullStreamText = "";
    const decoder = new TextDecoder();

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullStreamText += decoder.decode(value);
      }
    }

    expect(fullStreamText).toContain("event: done");
    expect(fullStreamText).toContain('"overallScore":null');
  });

  it("returns 404 for non-existent check id", async () => {
    const req = new NextRequest("http://localhost:3000/api/check/fake-id-123", {
      method: "GET",
    });
    const res = await GET(req, { params: { id: "fake-id-123" } });
    expect(res.status).toBe(404);
  });
});

