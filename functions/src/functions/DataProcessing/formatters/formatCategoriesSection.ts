import { EnrichedItem } from "../../../models/EnrichedReceiptData";

export const formatCategoriesSection = (
  categories: Record<string, EnrichedItem[]>
) => {
  const categoriesOutput = formatCategories(categories);

  return `## Categories:
${categoriesOutput}`;
};

const formatCategories = (categories: Record<string, EnrichedItem[]>) => {
  const formatted = Object.entries(categories).map(([category, items]) => {
    const itemsOutput = formatCategoryItems(items);
    return `- **${category}**:
${itemsOutput}`;
  });

  return formatted.join("\n");
};

const formatCategoryItems = (items: EnrichedItem[]) => {
  const formatted = items.map(
    (item) =>
      `  - **${item.name}**: ${item.quantity} * ${item.unitPrice} zł = ${item.totalPrice} zł`
  );

  return formatted.join("\n");
};
