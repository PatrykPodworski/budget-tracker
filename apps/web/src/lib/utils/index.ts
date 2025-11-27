import { Currency, currencyLocales } from "@budget-tracker/shared/currency";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number, currency: Currency = "PLN") => {
  const locale = currencyLocales[currency];
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const formatDateTime = (date?: Date) => {
  if (!date) {
    return "N/A";
  }

  // If the time is UTC midnight, only show the date
  if (date.getTime() % 86400000 === 0) {
    return formatDate(date);
  }

  return `${formatDate(date)} ${formatTime(date)}`;
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("pl-pl", {
    year: "numeric",
    month: "numeric",
    day: "2-digit",
    timeZone: "Europe/Warsaw",
  });

const formatTime = (date: Date) =>
  date.toLocaleTimeString("pl-pl", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Warsaw",
  });
