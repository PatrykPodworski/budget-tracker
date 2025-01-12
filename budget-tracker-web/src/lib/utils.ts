import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(amount);
};

export const formatDate = (date?: Date) => {
  if (!date) {
    return "N/A";
  }

  // If the time is UTC midnight, only show the date
  if (date.getTime() % 86400000 === 0) {
    return date.toLocaleDateString("pl-pl");
  }

  return `${date.toLocaleDateString("pl-pl")} ${date.toLocaleTimeString(
    "pl-pl"
  )}`;
};
