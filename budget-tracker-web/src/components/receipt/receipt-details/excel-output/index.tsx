"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { generateExcelFormulas } from "@/lib/excel-formula/generate-excel-formulas";
import { EnrichedItem } from "@/models/enriched-item-schema";
import { ExcelFormula } from "./excel-formula";

export const ExcelOutput = ({ items }: ExcelOutputProps) => {
  const formulas = generateExcelFormulas(items);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Excel Output</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {Object.entries(formulas).map(([category, formula], index) => (
          <ExcelFormula category={category} key={index} formula={formula} />
        ))}
      </CardContent>
    </Card>
  );
};

type ExcelOutputProps = {
  items: EnrichedItem[];
};
