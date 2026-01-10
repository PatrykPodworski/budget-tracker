/**
 * Splits an amount equally among participants, handling rounding correctly
 * so the sum of split amounts equals the original total.
 */
export const splitAmount = (
  amount: number,
  participantCount: number,
  decimalPlaces: number = 2
): number[] => {
  if (participantCount <= 0) {
    return [];
  }

  const multiplier = Math.pow(10, decimalPlaces);
  const totalCents = Math.round(amount * multiplier);
  const baseCentsPerParticipant = Math.floor(totalCents / participantCount);
  const remainingCents = totalCents - baseCentsPerParticipant * participantCount;

  return Array.from({ length: participantCount }, (_, index) => {
    const cents =
      index < remainingCents
        ? baseCentsPerParticipant + 1
        : baseCentsPerParticipant;

    return cents / multiplier;
  });
};
