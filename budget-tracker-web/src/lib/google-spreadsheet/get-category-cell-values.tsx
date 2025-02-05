import { EnrichedItem } from "@/models/enriched-item-schema";
import { CellValues } from "./cell-write";
import { formatCurrency } from "../utils";

// TODO: P1 Validate categories and update the return type
// TODO: P1 Consider returning a collection
export const getCategoryCellValues = (items: EnrichedItem[]) => {
  const groupedItems = groupItemsByCategory(items);
  const cellValues = generateCategoryCellValues(groupedItems);

  return cellValues;
};

const groupItemsByCategory = (items: EnrichedItem[]) => {
  const grouped = items.reduce((acc: Record<string, EnrichedItem[]>, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }

    acc[item.category].push(item);
    return acc;
  }, {});

  return grouped;
};

const generateCategoryCellValues = (
  grouped: Record<string, EnrichedItem[]>
) => {
  const sheetsFormulas = Object.entries(grouped).reduce(
    (acc: Record<string, CellValues>, [category, items]) => {
      const formula = formatCategoryFormula(items);
      const comment = formatCategoryComment(items);
      acc[category] = { formula, comment };
      return acc;
    },
    {}
  );

  return sheetsFormulas;
};

const formatCategoryFormula = (items: EnrichedItem[]) => {
  return `SUM(${items.map(formatItemPriceFormula).join(",")})`;
};

const formatItemPriceFormula = (item: EnrichedItem) => {
  const notRoundedPrice = `${item.unitPrice}*${item.quantity}`;
  const fullPrice = Number.isInteger(item.quantity)
    ? notRoundedPrice
    : `ROUND(${notRoundedPrice}, 2)`;

  return item.discount > 0 ? `${fullPrice}-${item.discount}` : fullPrice;
};

const formatCategoryComment = (items: EnrichedItem[]) => {
  return items
    .map((item) => `${formatCurrency(item.totalPrice)}\t${item.name}`)
    .join("\n");
};
