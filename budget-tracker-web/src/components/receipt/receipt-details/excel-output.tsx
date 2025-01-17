"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { generateExcelFormulas } from "@/lib/excel-formula/generate-excel-formulas";
import { EnrichedItem } from "@/models/enriched-item-schema";

export const ExcelOutput = ({ items }: ExcelOutputProps) => {
  const formulas = generateExcelFormulas(items);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Excel Output</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="whitespace-break-spaces">
          {JSON.stringify(formulas, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
};

type ExcelOutputProps = {
  items: EnrichedItem[];
};
