import { formatCurrency } from "@/lib/utils";
import React from "react";
import { getItemTotalPrice } from "./get-item-total-price";

export const PriceTotal = ({ item }: PriceTotalProps) => {
  const total = getItemTotalPrice(item);

  return (
    <div className="h-9 py-1 text-base flex items-center md:text-sm">
      {formatCurrency(total)}
    </div>
  );
};
type PriceTotalProps = {
  item: Parameters<typeof getItemTotalPrice>[0];
};
