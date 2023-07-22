import React from "react";

// A wrapper around the RangeDatepicker component applying some default props

interface Props {
  selectedDates: Date[];
  onDateChange: React.Dispatch<React.SetStateAction<Date[]>>;
}
export default function DateRangeInput({ selectedDates, onDateChange }: Props) {
  return (
    <DateRangeInput selectedDates={selectedDates} onDateChange={onDateChange} />
  );
}
