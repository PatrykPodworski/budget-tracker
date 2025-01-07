import { ContentData } from "../content-data";

export const formatGeneralSection = (data: ContentData) => `## General:
-  **Merchant:** ${data.merchantName ?? "Unknown"}
-  **Date of transaction:** ${data.dateOfTransaction ?? "Unknown"}
- **Total price:** 
  - **Does total price match:** ${data.totalDifference === 0 ? "Yes" : "No"}
  - **Declared:** ${data.total} zł
  - **Counted total:** ${data.countedTotal} zł
  - **Difference:** ${data.totalDifference} zł`;
