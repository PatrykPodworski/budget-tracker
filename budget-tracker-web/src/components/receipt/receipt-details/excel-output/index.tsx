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
import { basicWrite } from "@/lib/google-spreadsheet/basic-write";
import { EnrichedReceiptData } from "@/models/enriched-receipt-data-schema";
import { isCategory } from "@/data/categories";

export const ExcelOutput = ({ receipt }: ExcelOutputProps) => {
  const formulas = generateExcelFormulas(receipt.items);

  // TODO: P0 Refactor
  const handleClick = async () => {
    if (!receipt.transactionDate) {
      return;
    }

    await basicWrite({
      transactionDate: receipt.transactionDate,
      formula: receipt.total.toFixed(2),
      category: undefined,
    });

    const promises = Object.entries(formulas)
      .map(([category, formula]) => {
        if (isCategory(category) && receipt.transactionDate) {
          return basicWrite({
            transactionDate: receipt.transactionDate,
            category,
            formula,
          });
        }
      })
      .filter((x) => x !== undefined);

    await Promise.all(promises);
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
