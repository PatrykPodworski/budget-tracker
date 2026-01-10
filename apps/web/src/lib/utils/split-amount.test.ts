import { describe, it, expect } from "vitest";
import { splitAmount, SplitParticipant } from "./split-amount";

describe("splitAmount", () => {
  describe("basic splitting", () => {
    it("splits evenly when amount divides perfectly", () => {
      const result = splitAmount(10.0, [
        { id: "person1", sharePercentage: 50 },
        { id: "person2", sharePercentage: 50 },
      ]);

      expect(result).toEqual([
        { id: "person1", amount: 5.0 },
        { id: "person2", amount: 5.0 },
      ]);
    });

    it("handles single participant with 100%", () => {
      const result = splitAmount(9.99, [
        { id: "person1", sharePercentage: 100 },
      ]);

      expect(result).toEqual([{ id: "person1", amount: 9.99 }]);
    });

    it("returns empty array for no participants", () => {
      const result = splitAmount(10.0, []);
      expect(result).toEqual([]);
    });
  });

  describe("rounding edge cases - the main bug fix", () => {
    it("splits 9.99 between two people (50/50) correctly", () => {
      const result = splitAmount(9.99, [
        { id: "person1", sharePercentage: 50 },
        { id: "person2", sharePercentage: 50 },
      ]);

      // First person gets 5.00, second gets 4.99
      expect(result[0].amount).toBe(5.0);
      expect(result[1].amount).toBe(4.99);

      // Sum must equal original
      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(9.99, 2);
    });

    it("splits 10.01 between two people (50/50) correctly", () => {
      const result = splitAmount(10.01, [
        { id: "person1", sharePercentage: 50 },
        { id: "person2", sharePercentage: 50 },
      ]);

      // Each should get 5.005, rounded: 5.01 and 5.00
      expect(result[0].amount).toBe(5.01);
      expect(result[1].amount).toBe(5.0);

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(10.01, 2);
    });

    it("splits 100.00 between three people equally", () => {
      const result = splitAmount(100.0, [
        { id: "person1", sharePercentage: 33.34 },
        { id: "person2", sharePercentage: 33.33 },
        { id: "person3", sharePercentage: 33.33 },
      ]);

      // Sum must equal original
      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(100.0, 2);
    });

    it("splits 10.00 between three people (33.33/33.33/33.34)", () => {
      const result = splitAmount(10.0, [
        { id: "person1", sharePercentage: 33.33 },
        { id: "person2", sharePercentage: 33.33 },
        { id: "person3", sharePercentage: 33.34 },
      ]);

      // Sum must equal original
      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(10.0, 2);

      // Each person should get approximately 3.33
      expect(result[0].amount).toBeCloseTo(3.33, 2);
      expect(result[1].amount).toBeCloseTo(3.33, 2);
      expect(result[2].amount).toBeCloseTo(3.34, 2);
    });

    it("splits 1.00 between three people equally (edge case)", () => {
      const result = splitAmount(1.0, [
        { id: "person1", sharePercentage: 33.34 },
        { id: "person2", sharePercentage: 33.33 },
        { id: "person3", sharePercentage: 33.33 },
      ]);

      // 100 cents / 3 = 33.33 cents each, but we have only 100 cents
      // So we should get: 34, 33, 33 cents
      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(1.0, 2);
    });

    it("handles 0.01 split between two people", () => {
      const result = splitAmount(0.01, [
        { id: "person1", sharePercentage: 50 },
        { id: "person2", sharePercentage: 50 },
      ]);

      // Only 1 cent to split - first person gets it
      expect(result[0].amount).toBe(0.01);
      expect(result[1].amount).toBe(0.0);

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(0.01, 2);
    });

    it("handles 0.03 split between two people", () => {
      const result = splitAmount(0.03, [
        { id: "person1", sharePercentage: 50 },
        { id: "person2", sharePercentage: 50 },
      ]);

      // 3 cents split 50/50 = 1.5 cents each
      // First person gets 2 cents (1 + extra), second gets 1 cent
      expect(result[0].amount).toBe(0.02);
      expect(result[1].amount).toBe(0.01);

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(0.03, 2);
    });
  });

  describe("uneven percentage splits", () => {
    it("handles 70/30 split correctly", () => {
      const result = splitAmount(10.0, [
        { id: "person1", sharePercentage: 70 },
        { id: "person2", sharePercentage: 30 },
      ]);

      expect(result[0].amount).toBe(7.0);
      expect(result[1].amount).toBe(3.0);

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(10.0, 2);
    });

    it("handles 70/30 split with rounding needed", () => {
      const result = splitAmount(9.99, [
        { id: "person1", sharePercentage: 70 },
        { id: "person2", sharePercentage: 30 },
      ]);

      // 9.99 * 0.70 = 6.993 -> 6.99
      // 9.99 * 0.30 = 2.997 -> 3.00 (gets the extra cent due to higher remainder)
      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(9.99, 2);
    });

    it("handles 60/25/15 three-way split", () => {
      const result = splitAmount(100.0, [
        { id: "person1", sharePercentage: 60 },
        { id: "person2", sharePercentage: 25 },
        { id: "person3", sharePercentage: 15 },
      ]);

      expect(result[0].amount).toBe(60.0);
      expect(result[1].amount).toBe(25.0);
      expect(result[2].amount).toBe(15.0);

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(100.0, 2);
    });
  });

  describe("many participants", () => {
    it("handles five-way equal split", () => {
      const result = splitAmount(100.0, [
        { id: "person1", sharePercentage: 20 },
        { id: "person2", sharePercentage: 20 },
        { id: "person3", sharePercentage: 20 },
        { id: "person4", sharePercentage: 20 },
        { id: "person5", sharePercentage: 20 },
      ]);

      result.forEach((r) => {
        expect(r.amount).toBe(20.0);
      });

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(100.0, 2);
    });

    it("handles five-way split with rounding", () => {
      const result = splitAmount(10.01, [
        { id: "person1", sharePercentage: 20 },
        { id: "person2", sharePercentage: 20 },
        { id: "person3", sharePercentage: 20 },
        { id: "person4", sharePercentage: 20 },
        { id: "person5", sharePercentage: 20 },
      ]);

      // 1001 cents / 5 = 200.2 cents each
      // 5 * 200 = 1000, remainder = 1 cent
      // First person gets the extra cent
      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(10.01, 2);
    });
  });

  describe("preserves order", () => {
    it("returns results in the same order as input participants", () => {
      const participants: SplitParticipant[] = [
        { id: "charlie", sharePercentage: 25 },
        { id: "alice", sharePercentage: 50 },
        { id: "bob", sharePercentage: 25 },
      ];

      const result = splitAmount(9.99, participants);

      expect(result[0].id).toBe("charlie");
      expect(result[1].id).toBe("alice");
      expect(result[2].id).toBe("bob");
    });
  });

  describe("validation", () => {
    it("throws error when percentages don't sum to 100", () => {
      expect(() =>
        splitAmount(10.0, [
          { id: "person1", sharePercentage: 50 },
          { id: "person2", sharePercentage: 40 },
        ])
      ).toThrow("Share percentages must sum to 100");
    });

    it("throws error when percentages exceed 100", () => {
      expect(() =>
        splitAmount(10.0, [
          { id: "person1", sharePercentage: 60 },
          { id: "person2", sharePercentage: 60 },
        ])
      ).toThrow("Share percentages must sum to 100");
    });
  });

  describe("zero and edge amounts", () => {
    it("handles zero amount", () => {
      const result = splitAmount(0, [
        { id: "person1", sharePercentage: 50 },
        { id: "person2", sharePercentage: 50 },
      ]);

      expect(result[0].amount).toBe(0);
      expect(result[1].amount).toBe(0);
    });

    it("handles very large amount", () => {
      const result = splitAmount(999999.99, [
        { id: "person1", sharePercentage: 50 },
        { id: "person2", sharePercentage: 50 },
      ]);

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(999999.99, 2);
    });
  });

  describe("custom decimal places", () => {
    it("handles 0 decimal places (like JPY)", () => {
      const result = splitAmount(
        999,
        [
          { id: "person1", sharePercentage: 50 },
          { id: "person2", sharePercentage: 50 },
        ],
        0
      );

      expect(result[0].amount).toBe(500);
      expect(result[1].amount).toBe(499);

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBe(999);
    });

    it("handles 3 decimal places", () => {
      const result = splitAmount(
        9.999,
        [
          { id: "person1", sharePercentage: 50 },
          { id: "person2", sharePercentage: 50 },
        ],
        3
      );

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(9.999, 3);
    });
  });
});
