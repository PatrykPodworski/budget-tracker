export const categories = [
  "Jedzenie dom",
  "Jedzenie miasto",
  "Napoje słodkie",
  "Przekąski",
  "Jedzenie dom - gotowce",
  "Kawa, herbata",
  "Alkohol",
  "Catering",
  "Czynsz",
  "Prąd",
  "Internet i TV",
  "Wyposażenie stałe",
  "Eksploatacja",
  "Podatki",
  "Sprzątanie",
  "Pranie",
  "Kuchnia i łazienka",
  "Kosmetyki Damskie",
  "Kosmetyki Męskie",
  "Kosmetyki wspólne",
  "Wakacje",
  "Wyjścia",
  "VoD",
  "Lekarstwa",
  "Suplementy",
  "Paliwo",
  "Parking",
  "Płatne drogi",
  "Samochód - Ubezpieczenia",
  "Samochód - Naprawy",
  "Samochód - Wyposażenie",
  "Transport miejski",
  "Taxi",
  "Pociągi",
  "Prezenty",
  "Subskrybcje",
] as const;

const categorySet = new Set<string>(categories);

export type ReceiptCategory = (typeof categories)[number];

export const isCategory = (category: string): category is ReceiptCategory => {
  return categorySet.has(category);
};
