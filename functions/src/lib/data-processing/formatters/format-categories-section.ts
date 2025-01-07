import { EnrichedItem } from "../../../models/enriched-item-schema";

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
  const formatted = items.map(formatItem);

  return formatted.join("\n");
};

const formatItem = (item: EnrichedItem) =>
  item.discount !== 0
    ? `  - **${item.name}**: (${item.quantity} * ${item.unitPrice} zł) - ${
        item.discount
      } zł = ${(item.totalPrice * 100 - item.discount * 100) / 100} zł`
    : `  - **${item.name}**: ${item.quantity} * ${item.unitPrice} zł = ${item.totalPrice} zł`;
