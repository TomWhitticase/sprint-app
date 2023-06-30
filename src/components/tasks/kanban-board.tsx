import React, { useEffect, useRef, useState } from "react";
import TaskCard from "./task-card";
import { Task, TaskComment, TaskStatus, User } from "@prisma/client";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { NewTaskInputs } from "@/hooks/use-tasks";

export interface KanbanBoardProps {
  tasks: (Task & {
    assignees: User[];
  })[];
  updateTask: UseMutateAsyncFunction<
    any,
    unknown,
    {
      taskId: string;
      updatedData: NewTaskInputs;
    },
    unknown
  >;
}

export default function KanbanBoard({ tasks, updateTask }: KanbanBoardProps) {
  function getTaskStatus(status: TaskStatus) {
    switch (status) {
      case "TODO":
        return "toDoTasks";
      case "INPROGRESS":
        return "inProgressTasks";
      case "REVIEW":
        return "reviewTasks";
      case "COMPLETED":
        return "completedTasks";
    }
  }

  const initialTasksState = tasks.reduce(
    (acc, task) => {
      const taskStatus = getTaskStatus(task.status);
      acc[taskStatus] = [...acc[taskStatus], task.id] as any;
      return acc;
    },
    {
      toDoTasks: [],
      inProgressTasks: [],
      reviewTasks: [],
      completedTasks: [],
    }
  );

  const [overColumn, setOverColumn] = useState("");

  const [stateTasks, setStateTasks] = useState(initialTasksState);
  const [draggingTask, setDraggingTask] = useState("");

  const dragRef = useRef<HTMLDivElement>(null);

  const categories = [
    { name: "To-do", style: "bg-todo-red text-todo-red-text" },
    {
      name: "In-progress",
      style: "bg-in-progress-blue text-in-progress-blue-text",
    },
    { name: "Review", style: "bg-review-amber text-review-amber-text" },
    {
      name: "Completed",
      style: "bg-completed-green text-completed-green-text",
    },
  ];

  React.useEffect(() => {
    const handleMouseUp = () => setDraggingTask("");
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  React.useEffect(() => {
    let offsetX = 0;
    let offsetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (dragRef.current) {
        const width = dragRef.current.offsetWidth;
        const height = dragRef.current.offsetHeight;
        dragRef.current.style.top = `${e.clientY - height / 2}px`;
        dragRef.current.style.left = `${e.clientX - width / 2}px`;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (dragRef.current) {
        const { top, left } = dragRef.current.getBoundingClientRect();

        offsetX = e.clientX - left;
        offsetY = e.clientY - top;

        const width = dragRef.current.offsetWidth;
        const height = dragRef.current.offsetHeight;
        dragRef.current.style.top = `${e.clientY - height / 2}px`;
        dragRef.current.style.left = `${e.clientX - width / 2}px`;
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleMouseUp = async (category: keyof typeof initialTasksState) => {
    if (
      !draggingTask ||
      !stateTasks[category] ||
      (stateTasks[category] as any).includes(draggingTask)
    ) {
      return;
    }

    setStateTasks((prev) => {
      const newTasks = { ...prev };
      Object.keys(newTasks).forEach((key) => {
        (newTasks as any)[key as keyof typeof initialTasksState] = newTasks[
          key as keyof typeof initialTasksState
        ].filter((task) => task !== draggingTask);
      });

      (newTasks[category] as any).push(draggingTask);
      return newTasks;
    });

    // update the task's status in the database
    await updateTask({
      taskId: draggingTask,
      updatedData: { status: category.replace("Tasks", "").toUpperCase() },
    });
  };

  return (
    <div className="flex w-full h-full select-none mobile-only:flex-col">
      <div
        className={`fixed pointer-events-none z-[100] opacity-0 ${
          draggingTask && "opacity-100"
        }`}
        ref={dragRef}
      >
        <TaskCard
          onDrag={() => {}}
          task={
            tasks.find((task) => task.id === draggingTask) as Task & {
              assignees: User[];
              comments: TaskComment[];
            }
          }
        />
      </div>

      {categories.map(({ name, style }, index) => {
        const taskCategory = `${
          name.charAt(0).toLowerCase() +
          name.slice(1).replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
          })
        }Tasks` as keyof typeof initialTasksState;

        return (
          <div
            key={index}
            className={`flex flex-col h-full desktop-only:w-1/4 p-2 gap-2 rounded  ${
              overColumn === taskCategory && draggingTask ? "bg-slate-200" : ""
            }`}
            onMouseUp={() => handleMouseUp(taskCategory)}
            onMouseEnter={() => setOverColumn(taskCategory)}
            onMouseLeave={() => setOverColumn("")}
          >
            <div
              className={`px-4 py-2 text-sm font-bold tracking-wider uppercase rounded whitespace-nowrap ${style}`}
            >
              {name}
            </div>

            {stateTasks[taskCategory] &&
              stateTasks[taskCategory].map((taskId) => {
                const task = tasks.find((task) => task.id === taskId);
                return (
                  <TaskCard
                    additionalClasses={
                      draggingTask === taskId ? "opacity-30" : undefined
                    }
                    key={taskId}
                    onDrag={() => setDraggingTask(taskId)}
                    task={
                      task as Task & {
                        assignees: User[];
                        comments: TaskComment[];
                      }
                    }
                  />
                );
              })}
          </div>
        );
      })}
    </div>
  );
}
