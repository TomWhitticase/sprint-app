import React, { use, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Task } from "@prisma/client";
import { RangeDatepicker } from "chakra-dayzed-datepicker";

export interface TasksLineChartProps {
  tasks: Task[] | undefined;
}

export default function TasksLineChart({ tasks }: TasksLineChartProps) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([
    new Date(),
    new Date(),
  ]);

  const tasksInRange =
    selectedDates[0] && selectedDates[1] && tasks
      ? tasks.filter(
          (task) =>
            new Date(task.startDate!).getTime() >= selectedDates[0].getTime() &&
            new Date(task.endDate!).getTime() <= selectedDates[1].getTime()
        )
      : [];

  // Generate chart data - tasks in range of selected dates
  const chartData = tasksInRange.reduce((acc, task) => {
    const startDate = new Date(task.startDate!).toISOString().split("T")[0];
    const endDate = new Date(task.endDate!).toISOString().split("T")[0];
    acc[startDate] = acc[startDate] ? acc[startDate] + 1 : 1;
    acc[endDate] = acc[endDate] ? acc[endDate] - 1 : -1;
    return acc;
  }, {} as { [date: string]: number });

  const data = chartData
    ? Object.keys(chartData).map((date) => ({
        date,
        "Tasks Started": chartData[date] > 0 ? chartData[date] : 0,
        "Tasks Due": chartData[date] < 0 ? -chartData[date] : 0,
      }))
    : undefined;

  // Function to convert dates from yyyy-mm-dd to dd/mm/yyyy
  const formatDate = (date: string) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (!tasks || tasks.length === 0) return;
    setSelectedDates([
      new Date(
        tasks?.sort(
          (a, b) =>
            new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime()
        )[0].startDate!
      ),
      new Date(
        tasks?.sort(
          (a, b) =>
            new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime()
        )[tasks.length - 1].endDate!
      ),
    ]);
  }, [tasks]);

  return (
    <div className="flex flex-col gap-4 p-4 bg-white border-2 rounded-lg">
      <div className="flex items-start justify-between">
        <h1 className="text-lg font-bold">Task Timeline</h1>
        <div className="">
          <RangeDatepicker
            configs={{
              dateFormat: "dd/MM/yyyy",
            }}
            selectedDates={selectedDates}
            onDateChange={setSelectedDates}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatDate} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            animateNewValues={false}
            type="monotone"
            dataKey="Tasks Started"
            stroke="#8884d8"
            strokeWidth={3}
            activeDot={{ r: 6 }}
          />
          <Line
            animateNewValues={false}
            strokeWidth={3}
            type="monotone"
            dataKey="Tasks Due"
            stroke="#82ca9d"
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
