"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { generateExcelFormulas } from "@/lib/excel-formula/generate-excel-formulas";
import { ExcelFormula } from "./excel-formula";
import { Button } from "@/components/ui/shadcn/button";
import { EnrichedReceiptData } from "@/models/enriched-receipt-data-schema";
import { writeReceipt } from "@/lib/google-spreadsheet/write-receipt";

export const ExcelOutput = ({ receipt }: ExcelOutputProps) => {
  const formulas = generateExcelFormulas(receipt.items);

  const handleClick = async () => {
    await writeReceipt(receipt);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Excel Output</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {Object.entries(formulas).map(([category, formula], index) => (
          <ExcelFormula category={category} key={index} formula={formula} />
        ))}
        <Button className="self-center" onClick={handleClick}>
          Send to budget
        </Button>
      </CardContent>
    </Card>
  );
};

type ExcelOutputProps = {
  receipt: EnrichedReceiptData;
};
