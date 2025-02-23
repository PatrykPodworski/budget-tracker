export type ProcessingBundle = {
  id: string;
  receipts: ProcessingBundleReceipt[];
};

type ProcessingBundleReceipt =
  | {
      id: string;
      status: "uploading" | "reading" | "processing" | "done";
    }
  | {
      id: string;
      status: "error";
      error: string;
    };
