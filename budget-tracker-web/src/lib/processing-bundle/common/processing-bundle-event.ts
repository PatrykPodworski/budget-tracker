import { ProcessingBundle } from "./processing-bundle";

export type ProcessingBundleEvent = {
  data: ProcessingBundle;
  isFinished: boolean;
};
