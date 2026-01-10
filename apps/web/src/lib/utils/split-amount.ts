/**
 * Splits an amount equally among participants, handling rounding correctly
 * so the sum of split amounts equals the original.
 *
 * Uses the Largest Remainder Method:
 * 1. Calculate the base amount per participant (floor)
 * 2. Distribute remaining cents to the first participants
 *
 * @param amount - The total amount to split (e.g., 9.99)
 * @param participantIds - Array of participant IDs to split among
 * @param decimalPlaces - Number of decimal places for the currency (default: 2)
 * @returns Array of split results with amounts that sum to the original
 *
 * @example
 * // Split 9.99 between two people equally
 * splitAmount(9.99, ["person1", "person2"]);
 * // Returns: [{ id: "person1", amount: 5.00 }, { id: "person2", amount: 4.99 }]
 */
export type SplitResult = {
  id: string;
  amount: number;
};

export const splitAmount = (
  amount: number,
  participantIds: string[],
  decimalPlaces: number = 2
): SplitResult[] => {
  if (participantIds.length === 0) {
    return [];
  }

  const participantCount = participantIds.length;
  const multiplier = Math.pow(10, decimalPlaces);

  // Convert to smallest currency unit (cents) to avoid floating point issues
  const totalCents = Math.round(amount * multiplier);

  // Calculate base amount per participant (floor division)
  const baseCentsPerParticipant = Math.floor(totalCents / participantCount);

  // Calculate how many cents we need to distribute to first participants
  const remainingCents = totalCents - baseCentsPerParticipant * participantCount;

  // Distribute: first `remainingCents` participants get one extra cent
  return participantIds.map((id, index) => {
    const cents =
      index < remainingCents
        ? baseCentsPerParticipant + 1
        : baseCentsPerParticipant;

    return {
      id,
      amount: cents / multiplier,
    };
  });
};
