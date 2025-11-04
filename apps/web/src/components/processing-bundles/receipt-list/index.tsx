import {
  ProgressBundleReceipt,
  ProgressBundleReceiptProps,
} from "./processing-bundle-receipt";

export const BundleReceiptList = ({ receipts }: BundleReceiptListProps) => {
  // TODO: P1 Add back button
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold">Receipt Processing Status</h1>
      <div className="flex flex-col gap-6">
        {receipts.map((x) => (
          <ProgressBundleReceipt key={x.id} {...x} />
        ))}
      </div>
    </div>
  );
};

type BundleReceiptListProps = {
  receipts: ProgressBundleReceiptProps[];
};
