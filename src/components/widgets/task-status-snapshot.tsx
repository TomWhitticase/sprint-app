import React from "react";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { Task, TaskStatus } from "@prisma/client";
import ReactLoading from "react-loading";

export interface TaskStatusSnapshotProps {
  tasks: Task[] | undefined;
}

export default function TaskStatusSnapshot({ tasks }: TaskStatusSnapshotProps) {
  // First, count the tasks in each status
  const statusCounts: Record<TaskStatus, number> = {
    TODO: 0,
    INPROGRESS: 0,
    REVIEW: 0,
    COMPLETED: 0,
  };
  tasks?.forEach((task) => {
    statusCounts[task.status]++;
  });

  // Then, transform this into the format Recharts expects
  const data = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }));
  const labelWidth = 90;
  const labelHeight = 25;
  const CustomizedAxisTick = (props: any) => {
    const { x, y, payload } = props;

    let statusClassNames = "";
    let statusLabel = "";
    switch (payload.value) {
      case "TODO":
        statusClassNames = "bg-todo-red text-todo-red-text";
        statusLabel = "To-Do";
        break;
      case "INPROGRESS":
        statusClassNames = "bg-in-progress-blue text-in-progress-blue-text";
        statusLabel = "In-Progress";
        break;
      case "REVIEW":
        statusClassNames = "bg-review-amber text-review-amber-text";
        statusLabel = "Review";
        break;
      case "COMPLETED":
        statusClassNames = "bg-completed-green text-completed-green-text";
        statusLabel = "Completed";
        break;
      default:
        break;
    }

    return (
      <g transform={`translate(${x - labelWidth},${y - labelHeight / 2})`}>
        <foreignObject width={labelWidth} height={labelHeight}>
          <div
            className={`flex items-center justify-start pl-2 text-[0.7rem] font-bold w-full h-full uppercase rounded ${statusClassNames}`}
          >
            {statusLabel}
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white border-2 rounded-lg w-min">
      <h1 className="text-lg font-bold">Task Status Snapshot</h1>
      <div className="relative">
        <BarChart
          className="relative"
          layout="vertical"
          width={500}
          height={250}
          data={data}
        >
          {tasks && (
            <>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                dataKey="status"
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
