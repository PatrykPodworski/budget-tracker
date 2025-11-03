const PROCESSING_STATUS_UPLOADED = "uploaded";
const PROCESSING_STATUS_READ = "read";
const PROCESSING_STATUS_ENRICHED = "enriched";
export const PROCESSING_STATUS_ERROR = "error";

export const PROCESSING_STEPS = [
  PROCESSING_STATUS_UPLOADED,
  PROCESSING_STATUS_READ,
  PROCESSING_STATUS_ENRICHED,
] as const;

type ProcessingStep = (typeof PROCESSING_STEPS)[number];
type ProcessingStatus = ProcessingStep | typeof PROCESSING_STATUS_ERROR;

export const getStepIndex = (step: ProcessingStatus) => {
  if (step === PROCESSING_STATUS_ERROR) {
    return PROCESSING_STEPS.length;
  }

  return PROCESSING_STEPS.indexOf(step as ProcessingStep);
};

export const isFinishedStatus = (status: ProcessingStatus) =>
  status === PROCESSING_STATUS_ENRICHED || status === PROCESSING_STATUS_ERROR;
