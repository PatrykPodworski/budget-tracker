import { Collapse } from "@/components/ui/collapse";
import { PriceInputs, PriceInputsProps } from "./price-inputs";
import { formatCurrency } from "@/lib/utils";
import { getItemTotalPrice } from "./get-item-total-price";

// TODO: P1 One change handler for all inputs
// TODO: P3 XS Label variant
export const PriceCollapse = ({
  item,
  id,
  isLoading,
  handleQuantityChange,
  handleUnitPriceChange,
  handleDiscountChange,
  className,
}: PriceCollapseProps) => {
  const total = getItemTotalPrice(item);

  return (
    <Collapse
      title={`${item.quantity} x ${formatCurrency(
        item.unitPrice
      )} - ${formatCurrency(item.discount)} = ${formatCurrency(total)}`}
      id={`${id}`}
      className={className}
    >
      <PriceInputs
        className="bg-accent"
        id={id}
        item={item}
        isLoading={isLoading}
        handleQuantityChange={handleQuantityChange}
        handleUnitPriceChange={handleUnitPriceChange}
        handleDiscountChange={handleDiscountChange}
      />
    </Collapse>
  );
};

type PriceCollapseProps = PriceInputsProps;
