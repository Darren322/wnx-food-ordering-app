import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the Edge middleware self-contained", async () => {
  const middleware = await readFile(
    new URL("../middleware.ts", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(
    middleware,
    /from\s+["'](?:@\/|\.\.?\/)/,
    "Vercel Edge middleware must not pull application modules into its bundle",
  );
});
