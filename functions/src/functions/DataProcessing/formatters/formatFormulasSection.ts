export const formatFormulasSection = (formulas: Record<string, string>) => {
  const formulasOutput = formatFormulas(formulas);
  return `## Formulas:
${formulasOutput}`;
};

const formatFormulas = (formulas: Record<string, string>) => {
  const formatted = Object.entries(formulas).map(
    ([category, formula]) => `- **${category}**: ${formula}`
  );

  return formatted.join("\n");
};
