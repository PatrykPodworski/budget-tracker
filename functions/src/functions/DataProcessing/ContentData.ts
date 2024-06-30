import { Item } from "../../models/EnrichedReceiptData";

export type ContentData = {
  categories: Record<string, Item[]>;
  formulas: Record<string, string>;
  total: number;
  countedTotal: number;
  totalDifference: number;
  dateOfTransaction?: string;
  merchantName?: string;
};
