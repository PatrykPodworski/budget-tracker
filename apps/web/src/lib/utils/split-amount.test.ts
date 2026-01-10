import { describe, it, expect } from "vitest";
import { splitAmount } from "./split-amount";

describe("splitAmount", () => {
  describe("basic splitting", () => {
    it("splits evenly when amount divides perfectly", () => {
      const result = splitAmount(10.0, ["person1", "person2"]);

      expect(result).toEqual([
        { id: "person1", amount: 5.0 },
        { id: "person2", amount: 5.0 },
      ]);
    });

    it("handles single participant", () => {
      const result = splitAmount(9.99, ["person1"]);

      expect(result).toEqual([{ id: "person1", amount: 9.99 }]);
    });

    it("returns empty array for no participants", () => {
      const result = splitAmount(10.0, []);
      expect(result).toEqual([]);
    });
  });

  describe("rounding edge cases - the main bug fix", () => {
    it("splits 9.99 between two people correctly", () => {
      const result = splitAmount(9.99, ["person1", "person2"]);

      // First person gets 5.00, second gets 4.99
      expect(result[0].amount).toBe(5.0);
      expect(result[1].amount).toBe(4.99);

      // Sum must equal original
      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(9.99, 2);
    });

    it("splits 10.01 between two people correctly", () => {
      const result = splitAmount(10.01, ["person1", "person2"]);

      // Each should get 5.005, rounded: 5.01 and 5.00
      expect(result[0].amount).toBe(5.01);
      expect(result[1].amount).toBe(5.0);

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(10.01, 2);
    });

    it("splits 10.00 between three people", () => {
      const result = splitAmount(10.0, ["person1", "person2", "person3"]);

      // 1000 cents / 3 = 333 cents each, remainder = 1
      // First person gets extra cent: 3.34, 3.33, 3.33
      expect(result[0].amount).toBe(3.34);
      expect(result[1].amount).toBe(3.33);
      expect(result[2].amount).toBe(3.33);

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(10.0, 2);
    });

    it("splits 100.00 between three people", () => {
      const result = splitAmount(100.0, ["person1", "person2", "person3"]);

      // 10000 cents / 3 = 3333 cents each, remainder = 1
      expect(result[0].amount).toBe(33.34);
      expect(result[1].amount).toBe(33.33);
      expect(result[2].amount).toBe(33.33);

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(100.0, 2);
    });

    it("splits 1.00 between three people (edge case)", () => {
      const result = splitAmount(1.0, ["person1", "person2", "person3"]);

      // 100 cents / 3 = 33 cents each, remainder = 1
      expect(result[0].amount).toBe(0.34);
      expect(result[1].amount).toBe(0.33);
      expect(result[2].amount).toBe(0.33);

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(1.0, 2);
    });

    it("handles 0.01 split between two people", () => {
      const result = splitAmount(0.01, ["person1", "person2"]);

      // Only 1 cent to split - first person gets it
      expect(result[0].amount).toBe(0.01);
      expect(result[1].amount).toBe(0.0);

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(0.01, 2);
    });

    it("handles 0.03 split between two people", () => {
      const result = splitAmount(0.03, ["person1", "person2"]);

      // 3 cents / 2 = 1 cent each, remainder = 1
      // First person gets extra cent
      expect(result[0].amount).toBe(0.02);
      expect(result[1].amount).toBe(0.01);

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(0.03, 2);
    });

    it("handles 0.05 split between three people", () => {
      const result = splitAmount(0.05, ["person1", "person2", "person3"]);

      // 5 cents / 3 = 1 cent each, remainder = 2
      // First two people get extra cent
      expect(result[0].amount).toBe(0.02);
      expect(result[1].amount).toBe(0.02);
      expect(result[2].amount).toBe(0.01);

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(0.05, 2);
    });
  });

  describe("many participants (up to 10)", () => {
    it("handles five-way equal split", () => {
      const result = splitAmount(100.0, [
        "person1",
        "person2",
        "person3",
        "person4",
        "person5",
      ]);

      result.forEach((r) => {
        expect(r.amount).toBe(20.0);
      });

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(100.0, 2);
    });

    it("handles five-way split with rounding", () => {
      const result = splitAmount(10.01, [
        "person1",
        "person2",
        "person3",
        "person4",
        "person5",
      ]);

      // 1001 cents / 5 = 200 cents each, remainder = 1
      // First person gets extra cent
      expect(result[0].amount).toBe(2.01);
      expect(result[1].amount).toBe(2.0);
      expect(result[2].amount).toBe(2.0);
      expect(result[3].amount).toBe(2.0);
      expect(result[4].amount).toBe(2.0);

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(10.01, 2);
    });

    it("handles ten-way split", () => {
      const participants = Array.from({ length: 10 }, (_, i) => `person${i + 1}`);
      const result = splitAmount(100.0, participants);

      result.forEach((r) => {
        expect(r.amount).toBe(10.0);
      });

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(100.0, 2);
    });

    it("handles ten-way split with maximum remainder", () => {
      const participants = Array.from({ length: 10 }, (_, i) => `person${i + 1}`);
      // 10.09 = 1009 cents, 1009 / 10 = 100 remainder 9
      // First 9 people get 101 cents (1.01), last person gets 100 cents (1.00)
      const result = splitAmount(10.09, participants);

      for (let i = 0; i < 9; i++) {
        expect(result[i].amount).toBe(1.01);
      }
      expect(result[9].amount).toBe(1.0);

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(10.09, 2);
    });
  });

  describe("preserves order", () => {
    it("returns results in the same order as input participants", () => {
      const result = splitAmount(9.99, ["charlie", "alice", "bob"]);

      expect(result[0].id).toBe("charlie");
      expect(result[1].id).toBe("alice");
      expect(result[2].id).toBe("bob");
    });
  });

  describe("zero and edge amounts", () => {
    it("handles zero amount", () => {
      const result = splitAmount(0, ["person1", "person2"]);

      expect(result[0].amount).toBe(0);
      expect(result[1].amount).toBe(0);
    });

    it("handles very large amount", () => {
      const result = splitAmount(999999.99, ["person1", "person2"]);

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(999999.99, 2);
    });
  });

  describe("custom decimal places", () => {
    it("handles 0 decimal places (like JPY)", () => {
      const result = splitAmount(999, ["person1", "person2"], 0);

      expect(result[0].amount).toBe(500);
      expect(result[1].amount).toBe(499);

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBe(999);
    });

    it("handles 3 decimal places", () => {
      const result = splitAmount(9.999, ["person1", "person2"], 3);

      expect(result[0].amount).toBe(5.0);
      expect(result[1].amount).toBe(4.999);

      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(sum).toBeCloseTo(9.999, 3);
    });
  });
});
