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
  });
