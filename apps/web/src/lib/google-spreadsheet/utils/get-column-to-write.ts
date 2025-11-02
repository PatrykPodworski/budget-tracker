// TODO: P3 Dynamic sheet day mapping
export const getColumnToWrite = (transactionDate: Date) => {
  const day = transactionDate.getDate();
  const column = dayToColumnMap(day);
  return column;
};

// Letter I
const FIRST_DAY_COLUMN = 8;
const dayToColumnMap = (day: number) => FIRST_DAY_COLUMN + day - 1;
