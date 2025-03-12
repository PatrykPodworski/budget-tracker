import {
  getStepIndex,
  PROCESSING_STEPS,
  ProcessingStatus,
} from "@/lib/processing-bundle/common/processing-steps";
import { ProgressStepperStep } from "./progress-stepper-step";
import { ProgressStepperBar } from "./progress-stepper-bar";

export const ProgressStepper = ({ status }: ProgressStepperProps) => {
  const currentStatusIndex = getStepIndex(status);
  return (
    <div className="flex justify-between">
      {PROCESSING_STEPS.map((step, index) => (
        <>
          <ProgressStepperStep
            key={step}
            name={PROCESSING_STATUS_DISPLAY_NAMES[step]}
            isFinished={currentStatusIndex >= index}
            index={index}
          />
          {index < PROCESSING_STEPS.length - 1 && (
            <ProgressStepperBar
              status={
                currentStatusIndex > index
                  ? "completed"
                  : currentStatusIndex === index
                  ? "inProgress"
                  : "notStarted"
              }
              key={`bar-${index}`}
            />
          )}
        </>
      ))}
    </div>
  );
};

export type ProgressStepperProps = {
  status: ProcessingStatus;
};

export const PROCESSING_STATUS_DISPLAY_NAMES: Record<ProcessingStatus, string> =
  {
    uploaded: "Uploaded",
    read: "Scanned",
    enriched: "Processed",
    error: "Error",
  };
