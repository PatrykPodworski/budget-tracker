import { ContentData } from "../ContentData";

export const formatGeneralSection = (data: ContentData) => `## Merchant: ${
  data.merchantName ?? "Unknown"
}
    ## Date of transaction: ${data.dateOfTransaction ?? "Unknown"}
    ## Does total price match: ${data.totalDifference === 0 ? "Yes" : "No"}
      ### Total: ${data.total}, 
      ### Counted total: ${data.countedTotal}, 
      ### Difference:  ${data.totalDifference}`;
