import { RangeDatepicker } from "chakra-dayzed-datepicker";
import React from "react";

// A wrapper around the RangeDatepicker component applying some default props

interface Props {
  selectedDates: Date[];
  onDateChange: React.Dispatch<React.SetStateAction<Date[]>>;
}
export default function DateRangeInput({ selectedDates, onDateChange }: Props) {
  return (
    <RangeDatepicker
      propsConfigs={{
        dateNavBtnProps: {
          colorScheme: "gray",
          variant: "solid",
        },
        dayOfMonthBtnProps: {
          defaultBtnProps: {
            _hover: {
              background: "blue.400",
              color: "white",
            },
          },
          isInRangeBtnProps: {
            background: "gray.200",
            color: "gray.600",
          },
          selectedBtnProps: {
            background: "orange.500",
            color: "white",
          },
          todayBtnProps: {
            background: "teal.300",
            color: "white",
          },
        },
        inputProps: {
          size: "sm",
          cursor: "pointer",
          borderWidth: 2,
        },
        popoverCompProps: {
          // popoverContentProps: {
          //   background: "gray.700",
          //   color: "white",
          // },
        },
        weekdayLabelProps: {
          fontWeight: "normal",
        },
        dateHeadingProps: {
          fontWeight: "semibold",
        },
      }}
      configs={{
        dateFormat: "dd/MM/yyyy",
      }}
      selectedDates={selectedDates}
      onDateChange={onDateChange}
    />
  );
}
