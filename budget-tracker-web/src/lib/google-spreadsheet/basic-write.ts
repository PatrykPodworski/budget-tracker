"use server";

import { env } from "@/env";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { getAuth } from "./get-auth";
import { categories } from "@/data/categories";

// TODO: P1 Split into multiple functions; write(what, where)
// TODO: P1 Write multiple cells API
// TODO: P2 Check for duplicated writes
// TODO: P2 Add comments for each write (comment, id, etc.)
// TODO: P3 Dynamic sheet month mapping
// TODO: P3 Dynamic sheet day mapping

export const basicWrite = async ({
  transactionDate,
  formula,
  category,
}: BasicWriteParams) => {
  const auth = await getAuth();
  const document = new GoogleSpreadsheet(env.GOOGLE_DOCUMENT_ID, auth);

  await document.loadInfo();

  const sheetTitle = getSheetTitleToWrite(transactionDate);
  const sheet = document.sheetsByTitle[sheetTitle];

  const column = getColumnToWrite(transactionDate);
  const row = getRowToWrite(category);
  await sheet.loadCells({
    startColumnIndex: column,
    endColumnIndex: column + 1,
    startRowIndex: row,
    endRowIndex: row + 1,
  });
  const cell = sheet.getCell(row, column);

  cell.value = cell.formula ? `${cell.formula}+${formula}` : `=${formula}`;

  await sheet.saveUpdatedCells();
};

type BasicWriteParams = {
  transactionDate: Date;
  formula: string;
  category: (typeof categories)[number] | undefined;
};

const getSheetTitleToWrite = (transactionDate: Date) => {
  const month = transactionDate.getMonth();
  const sheetTitle = monthToSheetTitleMap[month];
  return sheetTitle;
};

const getColumnToWrite = (transactionDate: Date) => {
  const column = dayToColumnMap(transactionDate.getDate());
  return column;
};

const getRowToWrite = (category: (typeof categories)[number] | undefined) => {
  if (!category) {
    return EXPENSES_ROW;
  }

  const row = categoryToRowMap[category];
  return row;
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
const categoryToRowMap: Record<(typeof categories)[number], number> = {
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
