import { z } from "zod";

export const currencies = ["PLN", "PHP"] as const;
export type Currency = (typeof currencies)[number];

export const isCurrency = (value: unknown): value is Currency => {
  return typeof value === "string" && currencies.includes(value as Currency);
};

export const exchangeRates: Record<Currency, number> = {
  PLN: 1,
  PHP: 0.063,
};

export const currencyLocales: Record<Currency, string> = {
  PLN: "pl-PL",
  PHP: "en-PH",
};

export const currencySchema = z.enum(currencies);

export const convertToBaseCurrency = (
  amount: number,
  currency: Currency
): number => {
  return amount * exchangeRates[currency];
};
