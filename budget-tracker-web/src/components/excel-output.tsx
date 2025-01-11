"use client";
import { generateExcelFormulas } from "@/lib/excel-formula/generate-excel-formulas";
import { EnrichedItem } from "@/models/enriched-item-schema";

export const ExcelOutput = ({ items }: ExcelOutputProps) => {
  const formulas = generateExcelFormulas(items);

  return (
    <div>
      <h2>Excel Output</h2>
      <pre>{JSON.stringify(formulas, null, 2)}</pre>
    </div>
  );
};

type ExcelOutputProps = {
  items: EnrichedItem[];
};
