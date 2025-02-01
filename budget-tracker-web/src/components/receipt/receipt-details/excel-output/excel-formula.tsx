export const ExcelFormula = ({ category, formula }: ExcelFormulaProps) => {
  return (
    <div className="flex gap-2 flex-wrap">
      <span className="text-base shrink-0 min-w-32">{category}</span>
      <span className="break-all">{formula}</span>
    </div>
  );
};

type ExcelFormulaProps = {
  category: string;
  formula: string;
};
