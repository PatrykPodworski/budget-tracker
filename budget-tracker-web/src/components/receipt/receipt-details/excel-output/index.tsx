"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { generateExcelFormulas } from "@/lib/excel-formula/generate-excel-formulas";
import { ExcelFormula } from "./excel-formula";
import { EnrichedReceiptData } from "@/models/enriched-receipt-data-schema";
import { writeReceipt } from "@/lib/google-spreadsheet/write-receipt";
import { useTransition } from "react";
import { LoadingButton } from "@/components/ui/loading-button";

export const ExcelOutput = ({ receipt }: ExcelOutputProps) => {
  const [isLoading, startTransition] = useTransition();
  const formulas = generateExcelFormulas(receipt.items);

  const handleClick = () => startTransition(() => writeReceipt(receipt));

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Excel Output</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {Object.entries(formulas).map(([category, formula], index) => (
          <ExcelFormula category={category} key={index} formula={formula} />
        ))}
        <LoadingButton
          className="self-center"
          onClick={handleClick}
          loading={isLoading}
        >
          Send to budget
        </LoadingButton>
      </CardContent>
    </Card>
  );
};

type ExcelOutputProps = {
  receipt: EnrichedReceiptData;
};
