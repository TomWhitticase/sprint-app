import React from "react";
import {
  Gantt,
  EventOption,
  StylingOption,
  ViewMode,
  DisplayOption,
} from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { Task, User } from "@prisma/client";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { TodoItem } from "./task-card";

export interface TaskCalendarProps {
  tasks: (Task & { assignees: User[] })[];
}
export default function TaskCalendar(props: TaskCalendarProps) {
  const [viewMode, setViewMode] = React.useState<ViewMode>(ViewMode.Day);
  const router = useRouter();
  let columnWidth = 65;
  if (viewMode === ViewMode.Year) {
    columnWidth = 350;
  } else if (viewMode === ViewMode.Month) {
    columnWidth = 300;
  } else if (viewMode === ViewMode.Week) {
    columnWidth = 250;
  }

  const cycleViewMode = () => {
    switch (viewMode) {
      case ViewMode.Day:
        setViewMode(ViewMode.Week);
        break;
      case ViewMode.Week:
        setViewMode(ViewMode.Month);
        break;
      case ViewMode.Month:
        setViewMode(ViewMode.Day);
        break;
    }
  };

  if (!props.tasks || props.tasks.length < 1)
    return (
      <div className="flex items-center justify-center w-full">
        <div className="p-4 bg-white border-2 rounded-lg text-slate-500">
          No tasks to display
        </div>
      </div>
    );

  return (
    <div className="relative flex flex-col gap-4">
      <div className="absolute -top-10 right-2 flex flex-row gap-4 z-[10]">
        <Button size={"sm"} variant={"white"} onClick={cycleViewMode}>
          {viewMode === ViewMode.Day
            ? "Day"
            : viewMode === ViewMode.Week
            ? "Week"
            : viewMode === ViewMode.Month
            ? "Month"
            : "Year"}{" "}
          {" View"}
        </Button>
      </div>

      <Gantt
        onClick={(t) => {
          const task = props.tasks.find((task) => task.id === t.id);
          if (!task) return;
          router.push("/projects/" + task.projectId + "/tasks/" + task.id);
        }}
        columnWidth={columnWidth}
        viewMode={viewMode}
        listCellWidth={""}
        tasks={formatTasks(props) as any}
      />
    </div>
  );
}
function formatTasks(props: TaskCalendarProps) {
  return props.tasks
    .filter((t) => {
      return t.startDate && t.endDate;
    })
    .map((t) => {
      return {
        start: new Date(t.startDate as Date),
        end: new Date(t.endDate as Date),
        name: t.name,
        id: t.id,
        type: "task",
        progress:
          ((t.todos as any as TodoItem[]).filter((t) => t.completed).length /
            (t.todos as any as TodoItem[]).length) *
            100 || 0,
        isDisabled: false,
        styles: {
          progressColor: "#38A169",
          progressSelectedColor: "#37A068",
        },
      };
    });
}
