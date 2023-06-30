import { Task, TaskComment, User } from "@prisma/client";
import React from "react";
import UserAvatar from "../users/user-avatar";
import { TbFlagFilled } from "react-icons/tb";
import { useRouter } from "next/router";
import { Divider, Progress, Text, Tooltip } from "@chakra-ui/react";
import { BiCheckboxChecked, BiCheckbox, BiComment } from "react-icons/bi";
import { FaClock } from "react-icons/fa";
import { CgSandClock } from "react-icons/cg";
import DeadlineBadge from "./badges/deadline-badge";
import UserAvatarGroup from "../users/user-avatar-group";

export interface TodoItem {
  name: string;
  completed: boolean;
}

interface TaskCardProps {
  additionalClasses?: string;
  task: Task & {
    assignees: User[];
    comments: TaskComment[];
  };
  onDrag: (e: React.DragEvent<HTMLDivElement>) => void;
}
export default function TaskCard({
  task,
  onDrag,
  additionalClasses,
}: TaskCardProps) {
  const router = useRouter();

  const [mouseHasMoved, setMouseHasMoved] = React.useState(false);
  if (!task) return <></>;

  const completedTodos = (task.todos as any as TodoItem[]).filter(
    (todo) => todo.completed
  ).length;
  const totalTodos = (task.todos as any as TodoItem[]).length;
  const percentageCompleted =
    Math.round((completedTodos / totalTodos) * 100) || 0;

  return (
    <div
      onMouseDown={(e: any) => {
        onDrag(e);
        setMouseHasMoved(false);
      }}
      onMouseMove={(e) => {
        if (!mouseHasMoved) setMouseHasMoved(true);
      }}
      onClick={() => {
        if (mouseHasMoved) return;
        router.push("/projects/" + task.projectId + "/tasks/" + task.id);
      }}
      className={
        "flex flex-col gap-2 p-4 bg-white border-2 rounded cursor-pointer " +
        additionalClasses
      }
    >
      <div className="flex items-center justify-between gap-2 h-min">
        <h1 className="text-lg font-bold">{task.name}</h1>
        <div className="flex items-center justify-end w-full gap-1">
          <UserAvatarGroup users={task.assignees} />
        </div>
        <Tooltip
          label={
            task.priority.charAt(0).toUpperCase() +
            task.priority.slice(1).toLowerCase() +
            " Priority"
          }
          aria-label="priority"
        >
          <span
            className="p-1"
            style={{
              color:
                task.priority === "HIGH"
                  ? "red"
                  : task.priority === "MEDIUM"
                  ? "goldenrod"
                  : "green",
            }}
          >
            <TbFlagFilled />
          </span>
        </Tooltip>
      </div>

      <Divider borderWidth={1} />

      <div>
        <h1>{task.description}</h1>
      </div>

      {totalTodos > 0 && (
        <>
          <div className="flex items-center justify-center gap-2 ">
            <Progress
              colorScheme="green"
              className="flex-1"
              value={percentageCompleted}
            />
            <Text color={"green"}>
              {completedTodos}/{totalTodos}
            </Text>
          </div>
          <div className="flex flex-col items-start justify-center gap-2 text-sm">
            {(task.todos as any as TodoItem[]).map((todo, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="">
                  {todo.completed ? (
                    <BiCheckboxChecked size={25} />
                  ) : (
                    <BiCheckbox size={25} />
                  )}
                </div>
                <span className="relative">
                  {todo.completed && (
                    <div className="absolute left-0 right-0 w-full h-[2px]  bg-black top-1/2"></div>
                  )}
                  {todo.name}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="flex items-center justify-between gap-2 text-[0.7rem]">
        {task.endDate && <DeadlineBadge deadline={task.endDate} />}
        <span className="flex items-center justify-center gap-1 px-2 py-1 rounded bg-slate-100">
          <BiComment /> {task.comments.length} comment
          {task.comments.length !== 1 && "s"}
        </span>
      </div>
    </div>
  );
}
