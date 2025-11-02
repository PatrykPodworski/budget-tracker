import {
  getStepIndex,
  PROCESSING_STEPS,
  ProcessingStatus,
} from "@/lib/processing-bundle/common/processing-steps";
import { ProgressStepperStep } from "./progress-stepper-step";
import { ProgressStepperBar } from "./progress-stepper-bar";
import { Fragment } from "react";

export const ProgressStepper = ({ status }: ProgressStepperProps) => {
  const currentStatusIndex = getStepIndex(status);
  return (
    <div className="flex justify-between">
      {PROCESSING_STEPS.map((step, index) => (
        <Fragment key={step}>
          <ProgressStepperStep
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
            />
          )}
        </Fragment>
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
