import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DatePickerProps {
  date?: Date;
  setDate: (date: Date) => void;
  disablePastDates?: boolean;
  disableFutureDates?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  placeholder?: string;
}

export function DatePicker({
  date,
  setDate,
  disablePastDates = false,
  disableFutureDates = false,
  minDate,
  maxDate,
  disabled = false,
  placeholder = "Select date",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  // Function to determine if a date should be disabled
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (disablePastDates && date < today) {
      return true;
    }

    if (disableFutureDates && date > today) {
      return true;
    }

    if (minDate && date < minDate) {
      return true;
    }

    if (maxDate && date > maxDate) {
      return true;
    }

    return false;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            if (newDate) {
              setDate(newDate);
              setOpen(false);
            }
          }}
          disabled={isDateDisabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}