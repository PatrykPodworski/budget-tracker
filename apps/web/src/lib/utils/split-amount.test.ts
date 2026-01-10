import { describe, it, expect } from "vitest";
import { splitAmount } from "./split-amount";

describe("splitAmount", () => {
  it("splits evenly when amount divides perfectly", () => {
    expect(splitAmount(10.0, 2)).toEqual([5.0, 5.0]);
  });

  it("handles single participant", () => {
    expect(splitAmount(9.99, 1)).toEqual([9.99]);
  });

  it("returns empty array for zero or negative participants", () => {
    expect(splitAmount(10.0, 0)).toEqual([]);
    expect(splitAmount(10.0, -1)).toEqual([]);
  });

  it("splits 9.99 between two people with correct rounding", () => {
    const result = splitAmount(9.99, 2);

    expect(result).toEqual([5.0, 4.99]);
    expect(result.reduce((a, b) => a + b, 0)).toBeCloseTo(9.99, 2);
  });

  it("splits between three people with correct rounding", () => {
    const result = splitAmount(10.0, 3);

    expect(result).toEqual([3.34, 3.33, 3.33]);
    expect(result.reduce((a, b) => a + b, 0)).toBeCloseTo(10.0, 2);
  });

  it("handles minimum cents edge case", () => {
    const result = splitAmount(0.01, 2);

    expect(result).toEqual([0.01, 0.0]);
  });

  it("handles ten participants with remainder", () => {
    const result = splitAmount(10.09, 10);

    expect(result.slice(0, 9).every((a) => a === 1.01)).toBe(true);
    expect(result[9]).toBe(1.0);
    expect(result.reduce((a, b) => a + b, 0)).toBeCloseTo(10.09, 2);
  });

  it("handles zero amount", () => {
    expect(splitAmount(0, 2)).toEqual([0, 0]);
  });
});
