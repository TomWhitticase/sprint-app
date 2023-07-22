import React from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { Task, User } from "@prisma/client";
import { Button, Checkbox } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { TodoItem } from "./task-card";
import DateRangeInput from "./date-range-input";

export interface TaskCalendarProps {
  tasks: (Task & { assignees: User[] })[];
}
export default function TaskCalendar(props: TaskCalendarProps) {
  const [viewMode, setViewMode] = React.useState<ViewMode>(ViewMode.Day);

  const router = useRouter();

  const [filteredTasks, setFilteredTasks] = React.useState(props.tasks);
  const firstTaskDate = React.useMemo(
    () =>
      new Date(
        Math.min.apply(
          null,
          props.tasks.map((task) => new Date(task.startDate || "").getTime())
        )
      ),
    [props.tasks]
  );

  const lastTaskDate = React.useMemo(
    () =>
      new Date(
        Math.max.apply(
          null,
          props.tasks.map((task) => new Date(task.endDate || "").getTime())
        )
      ),
    [props.tasks]
  );

  const [selectedDates, setSelectedDates] = React.useState<Date[]>([
    firstTaskDate,
    lastTaskDate,
  ]);
  const [
    includeCrossesOverDateBoundaries,
    setIncludeCrossesOverDateBoundaries,
  ] = React.useState<boolean>(false);

  const columnWidth = React.useMemo(() => {
    switch (viewMode) {
      case ViewMode.Day:
        return 65;
      case ViewMode.Week:
        return 250;
      case ViewMode.Month:
        return 300;
      case ViewMode.Year:
        return 350;
    }
  }, [viewMode]);

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

  // when selected dates change, filter tasks
  React.useEffect(() => {
    if (!props.tasks) return;
    const filtered = props.tasks.filter((task) => {
      if (includeCrossesOverDateBoundaries)
        return (
          task.startDate &&
          task.endDate &&
          new Date(task.startDate) <= selectedDates[1] &&
          new Date(task.endDate) >= selectedDates[0]
        );
      return (
        task.startDate &&
        task.endDate &&
        new Date(task.startDate) >= selectedDates[0] &&
        new Date(task.endDate) <= selectedDates[1]
      );
    });
    setFilteredTasks(filtered);
  }, [includeCrossesOverDateBoundaries, props.tasks, selectedDates]);

  if (!props.tasks || props.tasks.length < 1)
    return (
      <div className="flex items-center justify-center w-full">
        <div className="p-4 bg-white border-2 rounded-lg text-slate-500">
          No tasks to display
        </div>
      </div>
    );

  return (
    <div className="relative flex flex-col gap-2 p-2 bg-white border-2 rounded-lg">
      <div
        id="control-bar"
        className="flex items-center justify-start w-full gap-2"
      >
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

        <div className="">
          <DateRangeInput
            selectedDates={selectedDates}
            onDateChange={setSelectedDates}
          />
        </div>
        <Checkbox
          isChecked={includeCrossesOverDateBoundaries}
          onChange={(e) => {
            setIncludeCrossesOverDateBoundaries(e.target.checked);
          }}
        >
          <span className="text-sm">
            Include tasks that cross over date boundaries
          </span>
        </Checkbox>
      </div>

      {filteredTasks?.length === 0 ? (
        <div className="flex items-center justify-center p-4 bg-white border-2 rounded-lg">
          No tasks to display
        </div>
      ) : (
        <Gantt
          onClick={(t) => {
            const task = props.tasks.find((task) => task.id === t.id);
            if (!task) return;
            router.push("/projects/" + task.projectId + "/tasks/" + task.id);
          }}
          columnWidth={columnWidth}
          viewMode={viewMode}
          listCellWidth={""}
          tasks={formatTasks(filteredTasks || []) as any}
        />
      )}
    </div>
  );
}
function formatTasks(tasks: any) {
  return tasks
    .filter((t: any) => {
      return t.startDate && t.endDate;
    })
    .map((t: any) => {
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
