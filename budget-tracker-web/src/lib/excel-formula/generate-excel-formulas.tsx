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
  if (item.discount > 0) {
    return `${item.unitPrice}*${item.quantity}-${item.discount}`;
  }

  return `${item.unitPrice}*${item.quantity}`;
};
