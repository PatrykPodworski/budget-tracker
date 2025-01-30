import { EnrichedItem } from "@/models/enriched-item-schema";

// TODO: P1 Validate categories and update the return type
// TODO: P1 Consider returning a collection
export const generateExcelFormulas = (items: EnrichedItem[]) => {
  const groupedItems = groupItemsByCategory(items);
  const formulas = createExcelFormulas(groupedItems);

  return formulas;
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

const createExcelFormulas = (grouped: Record<string, EnrichedItem[]>) => {
  // for each category, create the excel formula
  const excelFormulas = Object.entries(grouped).reduce(
    (acc: Record<string, string>, [category, items]) => {
      acc[category] = `SUM(${items.map(formatItemPriceFormula).join(",")})`;
      return acc;
    },
    {}
  );

  return excelFormulas;
};

const formatItemPriceFormula = (item: EnrichedItem) => {
  const notRoundedPrice = `${item.unitPrice}*${item.quantity}`;
  const fullPrice = Number.isInteger(item.quantity)
    ? notRoundedPrice
    : `ROUND(${notRoundedPrice}, 2)`;

  return item.discount > 0 ? `${fullPrice}-${item.discount}` : fullPrice;
};
