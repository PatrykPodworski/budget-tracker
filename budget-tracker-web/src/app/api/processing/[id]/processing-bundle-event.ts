import { ProcessingBundle } from "@/lib/processing-bundle/common/processing-bundle";

export type ProcessingBundleEvent = {
  data: ProcessingBundle;
  isFinished: boolean;
};
