/**
 * Splits an amount among participants according to their share percentages,
 * handling rounding correctly so the sum of split amounts equals the original.
 *
 * Uses the Largest Remainder Method:
 * 1. Calculate raw amounts for each participant
 * 2. Floor all amounts to the smallest currency unit (cents)
 * 3. Distribute remaining cents to participants with largest remainders
 */

export type SplitParticipant = {
  id: string;
  sharePercentage: number;
};

export type SplitResult = {
  id: string;
  amount: number;
};

/**
 * Splits an amount among participants according to their share percentages.
 *
 * @param amount - The total amount to split (e.g., 9.99)
 * @param participants - Array of participants with their share percentages
 * @param decimalPlaces - Number of decimal places for the currency (default: 2)
 * @returns Array of split results with amounts that sum to the original
 *
 * @example
 * // Split 9.99 between two people (50/50)
 * splitAmount(9.99, [
 *   { id: "person1", sharePercentage: 50 },
 *   { id: "person2", sharePercentage: 50 }
 * ]);
 * // Returns: [{ id: "person1", amount: 5.00 }, { id: "person2", amount: 4.99 }]
 */
export const splitAmount = (
  amount: number,
  participants: SplitParticipant[],
  decimalPlaces: number = 2
): SplitResult[] => {
  if (participants.length === 0) {
    return [];
  }

  // Validate that percentages sum to 100
  const totalPercentage = participants.reduce(
    (sum, p) => sum + p.sharePercentage,
    0
  );
  if (Math.abs(totalPercentage - 100) > 0.01) {
    throw new Error(
      `Share percentages must sum to 100, got ${totalPercentage}`
    );
  }

  const multiplier = Math.pow(10, decimalPlaces);

  // Convert to smallest currency unit (cents) to avoid floating point issues
  const totalCents = Math.round(amount * multiplier);

  // Calculate raw amounts in cents
  const rawAmounts = participants.map((p) => ({
    id: p.id,
    rawCents: (totalCents * p.sharePercentage) / 100,
  }));

  // Floor all amounts
  const flooredAmounts = rawAmounts.map((r) => ({
    id: r.id,
    cents: Math.floor(r.rawCents),
    remainder: r.rawCents - Math.floor(r.rawCents),
  }));

  // Calculate how many cents we need to distribute
  const flooredSum = flooredAmounts.reduce((sum, r) => sum + r.cents, 0);
  let remainingCents = totalCents - flooredSum;

  // Sort by remainder (descending) to distribute cents fairly
  // Use index as tiebreaker for stable sorting
  const sortedByRemainder = flooredAmounts
    .map((r, index) => ({ ...r, originalIndex: index }))
    .sort((a, b) => {
      const remainderDiff = b.remainder - a.remainder;
      if (Math.abs(remainderDiff) > 0.0001) {
        return remainderDiff;
      }
      // Tiebreaker: earlier participants get priority
      return a.originalIndex - b.originalIndex;
    });

  // Distribute remaining cents to participants with largest remainders
  const results = new Map<string, number>();
  for (const participant of sortedByRemainder) {
    let cents = participant.cents;
    if (remainingCents > 0) {
      cents += 1;
      remainingCents -= 1;
    }
    results.set(participant.id, cents / multiplier);
  }

  // Return in original order
  return participants.map((p) => ({
    id: p.id,
    amount: results.get(p.id)!,
  }));
};
