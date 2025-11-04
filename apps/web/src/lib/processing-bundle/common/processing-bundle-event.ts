import { ProcessingBundle } from "@budget-tracker/shared/processing-bundle";

export type ProcessingBundleEvent = {
  data: ProcessingBundle;
  isFinished: boolean;
};
