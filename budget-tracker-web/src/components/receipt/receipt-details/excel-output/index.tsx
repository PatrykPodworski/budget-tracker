"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { getCategoryCellValues } from "@/lib/google-spreadsheet/get-category-cell-values";
import { ExcelFormula } from "./excel-formula";
import { writeReceipt } from "@/lib/google-spreadsheet/write-receipt";
import { useTransition } from "react";
import { LoadingButton } from "@/components/ui/loading-button";
import { EnrichedItem } from "@/models/enriched-item-schema";

// TODO: P1 Rename
export const ExcelOutput = ({
  items,
  merchantName,
  total,
  transactionDate,
}: ExcelOutputProps) => {
  const [isLoading, startTransition] = useTransition();
  const categoryCellValues = getCategoryCellValues(items);

  const handleClick = () => {
    if (!transactionDate) {
      return;
    }

    return startTransition(() =>
      writeReceipt({
        total,
        transactionDate,
        merchantName,
        items,
      })
    );
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Excel Output</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {Object.entries(categoryCellValues).map(
          ([category, { formula }], index) => (
            <ExcelFormula category={category} key={index} formula={formula} />
          )
        )}
        <LoadingButton
          className="self-center"
          onClick={handleClick}
          loading={isLoading}
          disabled={!!transactionDate}
        >
          Send to budget
        </LoadingButton>
      </CardContent>
    </Card>
  );
};

type ExcelOutputProps = {
  total: number;
  transactionDate?: Date;
  merchantName: string | undefined;
  items: EnrichedItem[];
};
