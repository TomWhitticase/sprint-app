import React, { useState } from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { Task, TaskPriority, TaskStatus } from "@prisma/client";
import ReactLoading from "react-loading";
import { TbFlagFilled } from "react-icons/tb";
import { CheckboxGroup, Stack, Checkbox } from "@chakra-ui/react";

export interface TaskPrioritySnapshotProps {
  tasks: Task[] | undefined;
}

export default function TaskPrioritySnapshot({
  tasks,
}: TaskPrioritySnapshotProps) {
  // Checkbox state
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>([
    "TODO",
    "INPROGRESS",
    "REVIEW",
  ]);

  // First, count the tasks in each priority
  const priorityCounts: Record<TaskPriority, number> = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
  };

  tasks
    ?.filter((task) => selectedStatuses.includes(task.status))
    .forEach((task) => {
      priorityCounts[task.priority]++;
    });

  // Then, transform this into the format Recharts expects
  const data = Object.entries(priorityCounts).map(([priority, count]) => ({
    priority,
    count,
  }));

  const labelWidth = 100;
  const labelHeight = 20;
  const CustomizedAxisTick = (props: any) => {
    const { x, y, payload } = props;

    let priorityClassNames = "";
    let priorityLabel = "";
    switch (payload.value) {
      case "LOW":
        priorityClassNames = " text-green-500";
        priorityLabel = "Low";
        break;
      case "MEDIUM":
        priorityClassNames = "text-amber-500";
        priorityLabel = "Medium";
        break;
      case "HIGH":
        priorityClassNames = "text-red-500";
        priorityLabel = "High";
        break;
      default:
        break;
    }

    return (
      <g transform={`translate(${x - labelWidth},${y - labelHeight / 2})`}>
        <foreignObject width={labelWidth} height={labelHeight}>
          <div
            className={`flex items-center justify-start w-full h-full ${priorityClassNames}`}
          >
            <TbFlagFilled className="mr-2" />
            {priorityLabel}
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white border-2 rounded-lg w-min">
      <h1 className="text-lg font-bold">Task Priority Snapshot</h1>
      <div className="flex items-center justify-center gap-2 text-sm mobile-only:flex-col">
        Include
        <CheckboxGroup
          value={selectedStatuses}
          onChange={(value) => setSelectedStatuses(value as TaskStatus[])}
        >
          <div className="flex gap-2 mobile-only:flex-col">
            <Checkbox
              className="p-1 px-2 text-sm border-2 rounded"
              value="TODO"
            >
              <p className="text-sm">To-do</p>
            </Checkbox>
            <Checkbox className="p-1 px-2 border-2 rounded" value="INPROGRESS">
              <p className="text-sm">In-Progress</p>
            </Checkbox>
            <Checkbox className="p-1 px-2 border-2 rounded" value="REVIEW">
              <p className="text-sm">Review</p>
            </Checkbox>
            <Checkbox className="p-1 px-2 border-2 rounded" value="COMPLETED">
              <p className="text-sm">Completed</p>
            </Checkbox>
          </div>
        </CheckboxGroup>
      </div>
      <div className="relative">
        <BarChart
          className="relative"
          layout="vertical"
          width={500}
          height={140}
          data={data}
        >
          {tasks && (
            <>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                dataKey="priority"
                type="category"
                width={labelWidth + 10}
                tick={<CustomizedAxisTick />}
              />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </>
          )}
        </BarChart>
        {!tasks && (
          <div className="absolute inset-0 flex items-center justify-center w-full h-full ">
            <ReactLoading type="bubbles" color="#CCC" />
          </div>
        )}
      </div>
    </div>
  );
}
