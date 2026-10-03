// Minimal body parsing for the desktop endpoints -- they only ever take a few
// short string fields, so no schema library.

// The largest legitimate body (connect/start) is well under 1 KB.
const MAX_BODY_BYTES = 4 * 1024;

// Reads the body as a stream and gives up past MAX_BODY_BYTES, so an
// oversized request is never buffered whole -- even one that lies about (or
// omits) its Content-Length.
async function readLimitedText(request: Request) {
  const declared = Number(request.headers.get("content-length"));
  if (declared > MAX_BODY_BYTES || !request.body) return null;

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

export async function readJsonObject(request: Request) {
  try {
    const text = await readLimitedText(request);
    if (text === null) return null;
    const body: unknown = JSON.parse(text);
    return body && typeof body === "object" && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export function stringField(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength ? trimmed : null;
}

export function badRequest(error: string) {
  return Response.json({ error }, { status: 400 });
}
