"use server";

import { env } from "@/env";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { getAuth } from "./get-auth";

export const basicWrite = async () => {
  const auth = await getAuth();
  const document = new GoogleSpreadsheet(env.GOOGLE_DOCUMENT_ID, auth);

  await document.loadInfo();
  console.log(document.title);

  const sheetsTitles = document.sheetsByIndex.map((sheet) => ({
    title: sheet.title,
    id: sheet.sheetId,
  }));
  console.log("Available sheets:", sheetsTitles);

  const sheet = document.sheetsByTitle["Styczeń"];
  await sheet.loadCells("D57:D57");
  const totalCell = sheet.getCellByA1("D57");
  console.log("Total cell value:", totalCell.formula);

  await sheet.loadCells("AM58:AM58");
  const cell = sheet.getCellByA1("AM58");
  cell.value = "";
  await sheet.saveUpdatedCells();
};
