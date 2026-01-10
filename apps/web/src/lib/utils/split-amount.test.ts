import { describe, it, expect } from "vitest";
import { splitAmount } from "./split-amount";

describe("splitAmount", () => {
  describe("basic splitting", () => {
    it("splits evenly when amount divides perfectly", () => {
      const result = splitAmount(10.0, 2);
      expect(result).toEqual([5.0, 5.0]);
    });

    it("handles single participant", () => {
      const result = splitAmount(9.99, 1);
      expect(result).toEqual([9.99]);
    });

    it("returns empty array for zero participants", () => {
      expect(splitAmount(10.0, 0)).toEqual([]);
    });

    it("returns empty array for negative participants", () => {
      expect(splitAmount(10.0, -1)).toEqual([]);
    });
  });

  describe("rounding edge cases", () => {
    it("splits 9.99 between two people correctly", () => {
      const result = splitAmount(9.99, 2);

      expect(result[0]).toBe(5.0);
      expect(result[1]).toBe(4.99);
      expect(result.reduce((a, b) => a + b, 0)).toBeCloseTo(9.99, 2);
    });

    it("splits 10.01 between two people correctly", () => {
      const result = splitAmount(10.01, 2);

      expect(result[0]).toBe(5.01);
      expect(result[1]).toBe(5.0);
      expect(result.reduce((a, b) => a + b, 0)).toBeCloseTo(10.01, 2);
    });

    it("splits 10.00 between three people", () => {
      const result = splitAmount(10.0, 3);

      expect(result[0]).toBe(3.34);
      expect(result[1]).toBe(3.33);
      expect(result[2]).toBe(3.33);
      expect(result.reduce((a, b) => a + b, 0)).toBeCloseTo(10.0, 2);
    });

    it("splits 100.00 between three people", () => {
      const result = splitAmount(100.0, 3);

      expect(result[0]).toBe(33.34);
      expect(result[1]).toBe(33.33);
      expect(result[2]).toBe(33.33);
      expect(result.reduce((a, b) => a + b, 0)).toBeCloseTo(100.0, 2);
    });

    it("splits 1.00 between three people", () => {
      const result = splitAmount(1.0, 3);

      expect(result[0]).toBe(0.34);
      expect(result[1]).toBe(0.33);
      expect(result[2]).toBe(0.33);
      expect(result.reduce((a, b) => a + b, 0)).toBeCloseTo(1.0, 2);
    });

    it("handles 0.01 split between two people", () => {
      const result = splitAmount(0.01, 2);

      expect(result[0]).toBe(0.01);
      expect(result[1]).toBe(0.0);
      expect(result.reduce((a, b) => a + b, 0)).toBeCloseTo(0.01, 2);
    });

    it("handles 0.03 split between two people", () => {
      const result = splitAmount(0.03, 2);

      expect(result[0]).toBe(0.02);
      expect(result[1]).toBe(0.01);
      expect(result.reduce((a, b) => a + b, 0)).toBeCloseTo(0.03, 2);
    });

    it("handles 0.05 split between three people", () => {
      const result = splitAmount(0.05, 3);

      expect(result[0]).toBe(0.02);
      expect(result[1]).toBe(0.02);
      expect(result[2]).toBe(0.01);
      expect(result.reduce((a, b) => a + b, 0)).toBeCloseTo(0.05, 2);
    });
  });

  describe("many participants", () => {
    it("handles five-way equal split", () => {
      const result = splitAmount(100.0, 5);

      result.forEach((amount) => expect(amount).toBe(20.0));
      expect(result.reduce((a, b) => a + b, 0)).toBeCloseTo(100.0, 2);
    });

    it("handles five-way split with rounding", () => {
      const result = splitAmount(10.01, 5);

      expect(result[0]).toBe(2.01);
      expect(result.slice(1).every((a) => a === 2.0)).toBe(true);
      expect(result.reduce((a, b) => a + b, 0)).toBeCloseTo(10.01, 2);
    });

    it("handles ten-way split", () => {
      const result = splitAmount(100.0, 10);

      result.forEach((amount) => expect(amount).toBe(10.0));
      expect(result.reduce((a, b) => a + b, 0)).toBeCloseTo(100.0, 2);
    });

    it("handles ten-way split with maximum remainder", () => {
      const result = splitAmount(10.09, 10);

      for (let i = 0; i < 9; i++) {
        expect(result[i]).toBe(1.01);
      }
      expect(result[9]).toBe(1.0);
      expect(result.reduce((a, b) => a + b, 0)).toBeCloseTo(10.09, 2);
    });
  });

  describe("edge amounts", () => {
    it("handles zero amount", () => {
      const result = splitAmount(0, 2);
      expect(result).toEqual([0, 0]);
    });

    it("handles very large amount", () => {
      const result = splitAmount(999999.99, 2);
      expect(result.reduce((a, b) => a + b, 0)).toBeCloseTo(999999.99, 2);
    });
  });

  describe("custom decimal places", () => {
    it("handles 0 decimal places (like JPY)", () => {
      const result = splitAmount(999, 2, 0);

      expect(result[0]).toBe(500);
      expect(result[1]).toBe(499);
      expect(result.reduce((a, b) => a + b, 0)).toBe(999);
    });

    it("handles 3 decimal places", () => {
      const result = splitAmount(9.999, 2, 3);

      expect(result[0]).toBe(5.0);
      expect(result[1]).toBe(4.999);
      expect(result.reduce((a, b) => a + b, 0)).toBeCloseTo(9.999, 3);
    });
  });
});
