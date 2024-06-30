import { Item } from "../../../models/EnrichedReceiptData";

export const formatCategoriesSection = (categories: Record<string, Item[]>) => {
  const categoriesOutput = formatCategories(categories);

  return `## Categories:
  ${categoriesOutput}`;
};

const formatCategories = (categories: Record<string, Item[]>) => {
  const formatted = Object.entries(categories).map(([category, items]) => {
    const itemsOutput = formatCategoryItems(items);
    return `- **${category}**:
    ${itemsOutput}`;
  });

  return formatted.join("\n");
};

const formatCategoryItems = (items: Item[]) => {
  const formatted = items.map(
    (item) =>
      `  - **${item.name}**: ${item.quantity} * ${item.unitPrice} = ${item.totalPrice}`
  );

  return formatted.join("\n");
};
