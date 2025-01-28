import { ReceiptCategory } from "@/data/categories";

export const getColumnToWrite = (transactionDate: Date) => {
  const column = dayToColumnMap(transactionDate.getDate());
  return column;
};

export const getRowToWrite = (category: ReceiptCategory | undefined) => {
  if (!category) {
    return EXPENSES_ROW;
  }

  const row = categoryToRowMap[category];
  return row;
};

export const getSheetTitleToWrite = (transactionDate: Date) => {
  const month = transactionDate.getMonth();
  const sheetTitle = monthToSheetTitleMap[month];
  return sheetTitle;
};

const monthToSheetTitleMap: Record<number, string> = {
  0: "Styczeń",
  1: "Luty",
  2: "Marzec",
  3: "Kwiecień",
  4: "Maj",
  5: "Czerwiec",
  6: "Lipiec",
  7: "Sierpień",
  8: "Wrzesień",
  9: "Październik",
  10: "Listopad",
  11: "Grudzień",
};

const FIRST_DAY_COLUMN = 8; // Letter I
const dayToColumnMap = (day: number) => FIRST_DAY_COLUMN + day - 1;

const EXPENSES_ROW = 57;

// TODO: P3 Read categories from the sheet
const categoryToRowMap: Record<ReceiptCategory, number> = {
  "Jedzenie dom": 79,
  "Jedzenie miasto": 80,
  "Napoje słodkie": 81,
  Przekąski: 82,
  "Jedzenie dom - gotowce": 83,
  "Kawa, herbata": 84,
  Alkohol: 85,
  Catering: 86,
  Czynsz: 91,
  Prąd: 92,
  "Internet i TV": 93,
  "Wyposażenie stałe": 94,
  Eksploatacja: 95,
  Podatki: 96,
  Sprzątanie: 103,
  Pranie: 104,
  "Kuchnia i łazienka": 105,
  "Kosmetyki Damskie": 106,
  "Kosmetyki Męskie": 107,
  "Kosmetyki wspólne": 108,
  Wakacje: 115,
  Wyjścia: 116,
  VoD: 117,
  Lekarstwa: 127,
  Suplementy: 128,
  Paliwo: 139,
  Parking: 140,
  "Płatne drogi": 141,
  "Samochód - Ubezpieczenia": 142,
  "Samochód - Naprawy": 143,
  "Samochód - Wyposażenie": 144,
  "Transport miejski": 151,
  Taxi: 152,
  Pociągi: 153,
  Prezenty: 163,
  Subskrybcje: 164,
};
