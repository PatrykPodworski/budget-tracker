import { ProcessingBundle } from "@/lib/upload/common/processing-bundle";

export type ProcessingBundleEvent = {
  data: ProcessingBundle;
  isFinished: boolean;
};
