"use client";

import { CircleCheck, CircleAlert } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/shadcn/popover";

const ICON_SIZE = 18;

export const ReceiptStatusIcon = ({ isSent }: ReceiptStatusIconProps) => (
  <Popover>
    <PopoverTrigger asChild>
      {isSent ? (
        <CircleCheck
          className="text-green-600 cursor-pointer"
          width={ICON_SIZE}
          height={ICON_SIZE}
        />
      ) : (
        <CircleAlert
          className="text-yellow-500 cursor-pointer"
          width={ICON_SIZE}
          height={ICON_SIZE}
        />
      )}
    </PopoverTrigger>
    <PopoverContent className="text-sm">
      {isSent ? "Receipt sent to budget" : "Receipt not sent to budget"}
    </PopoverContent>
  </Popover>
);

type ReceiptStatusIconProps = {
  isSent: boolean;
};
