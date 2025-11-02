// TODO: P3 Dynamic sheet month mapping
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
