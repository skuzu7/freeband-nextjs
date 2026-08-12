// @vitest-environment node
import { describe, it, expect } from "vitest";
import { createSession, verifySession, secretsMatch } from "../session";

const SECRET = "test-secret";

describe("createSession / verifySession", () => {
  it("accepts a freshly created session", async () => {
    const session = await createSession(SECRET);
    expect(await verifySession(session, SECRET)).toBe(true);
  });

  it("rejects an expired session", async () => {
    const tenSecondsAgo = Date.now() - 10_000;
    const session = await createSession(SECRET, 5, tenSecondsAgo);
    expect(await verifySession(session, SECRET)).toBe(false);
  });

  it("rejects a tampered expiry", async () => {
    const session = await createSession(SECRET);
    const [exp, signature] = session.split(".");
    const forged = `${Number(exp) + 99_999}.${signature}`;
    expect(await verifySession(forged, SECRET)).toBe(false);
  });

  it("rejects the legacy forgeable cookie value", async () => {
    expect(await verifySession("1", SECRET)).toBe(false);
  });

  it("rejects a session signed with a different secret", async () => {
    const session = await createSession("other-secret");
    expect(await verifySession(session, SECRET)).toBe(false);
  });

  it("rejects undefined and malformed values", async () => {
    expect(await verifySession(undefined, SECRET)).toBe(false);
    expect(await verifySession("", SECRET)).toBe(false);
    expect(await verifySession("no-dot-here", SECRET)).toBe(false);
  });
});

describe("secretsMatch", () => {
  it("matches identical secrets", async () => {
    expect(await secretsMatch("token-123", "token-123", SECRET)).toBe(true);
  });

  it("rejects different secrets, including different lengths", async () => {
    expect(await secretsMatch("token-123", "token-124", SECRET)).toBe(false);
    expect(await secretsMatch("short", "much-longer-token", SECRET)).toBe(false);
  });
});
