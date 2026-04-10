import { describe, it, expect, afterEach, vi } from "vitest";
import { validateToken } from "../token";

describe("validateToken", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should return true when token matches ORCAMENTO_TOKEN env var", () => {
    vi.stubEnv("ORCAMENTO_TOKEN", "secret-abc-123");
    expect(validateToken("secret-abc-123")).toBe(true);
  });

  it("should return false when token does not match env var", () => {
    vi.stubEnv("ORCAMENTO_TOKEN", "secret-abc-123");
    expect(validateToken("wrong-token")).toBe(false);
  });

  it("should return false when env var is unset", () => {
    vi.stubEnv("ORCAMENTO_TOKEN", "");
    expect(validateToken("any-token")).toBe(false);
  });

  it("should be case-sensitive", () => {
    vi.stubEnv("ORCAMENTO_TOKEN", "Secret");
    expect(validateToken("secret")).toBe(false);
    expect(validateToken("Secret")).toBe(true);
  });

  it("should return false when token is empty string", () => {
    vi.stubEnv("ORCAMENTO_TOKEN", "secret");
    expect(validateToken("")).toBe(false);
  });
});
