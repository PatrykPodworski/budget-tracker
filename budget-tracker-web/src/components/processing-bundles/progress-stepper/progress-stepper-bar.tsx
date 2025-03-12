import clsx from "clsx";

export const ProgressStepperBar = ({ status }: ProgressStepperBarProps) => {
  const barClasses = clsx(
    "h-1 rounded-full",
    status === "completed" && "bg-green-600",
    status === "notStarted" && "bg-gray-300"
  );

  if (status === "inProgress") {
    return (
      <div className="flex-1 mx-2 mt-5 bg-gray-300 rounded-full h-1 overflow-hidden">
        <div className="bg-green-600 h-full animate-fill-horizontal origin-left" />
      </div>
    );
  }

  return (
    <div className="flex-1 mx-2 mt-5">
      <div className={barClasses} />
    </div>
  );
};

type ProgressStepperBarProps = {
  status: "completed" | "inProgress" | "notStarted";
};
