"use client";

import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { cn, formatDateTime } from "@/lib/utils";
import { Button } from "./shadcn/button";
import { Calendar } from "./shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./shadcn/popover";
import { ScrollArea, ScrollBar } from "./shadcn/scroll-area";
import { pl } from "date-fns/locale";

const NUMBER_OF_HOURS = 24;
const NUMBER_OF_MINUTES = 60;

export const DateTimePicker = ({
  defaultValue,
  onChange,
  disabled,
}: DateTimePickerProps) => {
  const [selectedDate, setSelectedDate] = useState(defaultValue);

  const handleDateSelect = (newSelectedDate: Date | undefined) => {
    if (!newSelectedDate) {
      return;
    }

    if (selectedDate) {
      newSelectedDate.setHours(
        selectedDate.getHours(),
        selectedDate.getMinutes()
      );
    }

    setSelectedDate(newSelectedDate);
    onChange(newSelectedDate);
  };

  const handleTimeChange = (type: "hour" | "minute", newValue: string) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (type === "hour") {
        newDate.setHours(parseInt(newValue));
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(newValue));
      }
      setSelectedDate(newDate);
      onChange(newDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal text-base md:text-sm",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {selectedDate ? (
            formatDateTime(selectedDate)
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={selectedDate}
            disabled={disabled}
            onSelect={handleDateSelect}
            locale={pl}
            autoFocus
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {[...Array(NUMBER_OF_HOURS).keys()].map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      selectedDate && selectedDate.getHours() === hour
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    disabled={disabled}
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {[...Array(NUMBER_OF_MINUTES).keys()].map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      selectedDate && selectedDate.getMinutes() === minute
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    disabled={disabled}
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

type DateTimePickerProps = {
  defaultValue: Date | undefined;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
};
