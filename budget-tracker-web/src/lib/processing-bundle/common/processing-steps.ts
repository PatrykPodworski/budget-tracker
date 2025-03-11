export const PROCESSING_STATUS_UPLOADED = "uploaded";
export const PROCESSING_STATUS_READ = "read";
const PROCESSING_STATUS_FINISHED = "enriched";
export const PROCESSING_STATUS_ERROR = "error";

export const PROCESSING_STEPS = [
  PROCESSING_STATUS_UPLOADED,
  PROCESSING_STATUS_READ,
  PROCESSING_STATUS_FINISHED,
] as const;

export type ProcessingStatus =
  | (typeof PROCESSING_STEPS)[number]
  | typeof PROCESSING_STATUS_ERROR;

export const getStepIndex = (step: ProcessingStatus) => {
  if (step === PROCESSING_STATUS_ERROR) {
    return PROCESSING_STEPS.length;
  }

  return PROCESSING_STEPS.indexOf(step);
};

export const isFinishedStatus = (status: ProcessingStatus) =>
  status === PROCESSING_STATUS_FINISHED || status === PROCESSING_STATUS_ERROR;
