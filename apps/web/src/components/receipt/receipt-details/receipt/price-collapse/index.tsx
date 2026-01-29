import { useFormContext, useWatch } from "react-hook-form";
import { Collapse } from "@/components/ui/collapse";
import { PriceInputs } from "./price-inputs";
import { formatCurrency } from "@/lib/utils";
import { getItemTotalPrice } from "./get-item-total-price";
import { ReceiptFormData } from "@/lib/receipt-data/receipt-form-schema";

// TODO: P3 XS Label variant
export const PriceCollapse = ({ index, id }: PriceCollapseProps) => {
  const { control } = useFormContext<ReceiptFormData>();
  const item = useWatch({ control, name: `items.${index}` });
  const total = getItemTotalPrice(item);

  return (
    <Collapse
      title={`${item.quantity} x ${formatCurrency(
        item.unitPrice
      )} - ${formatCurrency(item.discount)} = ${formatCurrency(total)}`}
      id={`${id}`}
    >
      <PriceInputs id={id} index={index} />
    </Collapse>
  );
};

type PriceCollapseProps = {
  index: number;
  id: string;
};
