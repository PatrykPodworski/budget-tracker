import { Check } from "lucide-react";
import clsx from "clsx";

export const ProgressStepperStep = ({
  name,
  isFinished,
  index,
}: ProgressStepperStepProps) => {
  const circleClassName = clsx(
    "w-10 h-10 rounded-full flex items-center justify-center mb-1",
    isFinished
      ? "bg-green-600 text-white"
      : "bg-white text-gray-800 border-gray-300 border-2"
  );

  const stepContent = isFinished ? (
    <Check className="h-6 w-6" strokeWidth={3} />
  ) : (
    <span>{index + 1}</span>
  );

  return (
    <div className="flex flex-col items-center">
      <div className={circleClassName}>{stepContent}</div>
      <div className="text-xs text-gray-800">{name}</div>
    </div>
  );
};

type ProgressStepperStepProps = {
  name: string;
  isFinished: boolean;
  index: number;
};
