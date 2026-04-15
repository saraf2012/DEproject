import { describe, it, expect, vi, afterEach } from "vitest";
import { formatRelative, formatMonthYear } from "@/lib/time";

describe("formatRelative", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns hours for recent past", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-08T14:00:00Z"));
    const then = new Date("2026-04-08T12:00:00Z").toISOString();
    expect(formatRelative(then)).toBe("2h ago");
  });

  it("uses calendar date for older edits", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-08T14:00:00Z"));
    const s = formatRelative("2020-01-05T12:00:00Z");
    expect(s.length).toBeGreaterThan(3);
  });
});

describe("formatMonthYear", () => {
  it("returns uppercase month and year", () => {
    const s = formatMonthYear("2026-04-08");
    expect(s).toContain("2026");
    expect(s).toMatch(/^[A-Z]/);
  });
});
