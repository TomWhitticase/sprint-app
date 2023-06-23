import { Task, TaskStatus, User } from "@prisma/client";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tooltip,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import UserAvatar from "../users/user-avatar";
import { TbFlagFilled } from "react-icons/tb";
import React from "react";
import { get } from "http";
import { useRouter } from "next/router";
import DeadlineBadge from "./badges/deadline-badge";
import UserAvatarGroup from "../users/user-avatar-group";
import { TodoItem } from "./task-card";

interface TaskListProps {
  tasks: (Task & { assignees: User[] })[];
}
export default function TaskList({ tasks }: TaskListProps) {
  const router = useRouter();

  return (
    <Table size="sm" colorScheme="blackAlpha" className="p-4 bg-white border-2">
      <Thead>
        <Tr style={{ padding: "1rem" }}>
          <Th>Task Name</Th>
          <Th>Description</Th>
          <Th>Deadline</Th>
          <Th>Progress</Th>
          <Th>Status</Th>
          <Th>Priority</Th>
          <Th>Assignees</Th>
        </Tr>
      </Thead>
      <Tbody>
        {tasks.map((task) => (
          <Tr
            onClick={() => {
              router.push("/projects/" + task.projectId + "/tasks/" + task.id);
            }}
            key={task.id}
            className="cursor-pointer hover:bg-slate-100"
          >
            <Td className="py-4 font-bold">{task.name}</Td>
            <Td>{task.description}</Td>
            <Td>
              <div className="flex">
                {task.endDate && <DeadlineBadge deadline={task.endDate} />}
              </div>
            </Td>
            <Td>
              {(task.todos as any as TodoItem[]).length > 0 && (
                <CircularProgress
                  value={
                    ((task.todos as any as TodoItem[]).filter(
                      (todo) => todo.completed
                    ).length /
                      (task.todos as any as TodoItem[]).length) *
                    100
                  }
                  color="green.400"
                >
                  <CircularProgressLabel>
                    {(
                      ((task.todos as any as TodoItem[]).filter(
                        (todo) => todo.completed
                      ).length /
                        (task.todos as any as TodoItem[]).length) *
                      100
                    ).toFixed(0) + "%"}
                  </CircularProgressLabel>
                </CircularProgress>
              )}
            </Td>
            <Td>
              <div className="flex">
                <div
                  className={`px-2 font-bold text-sm py-1 rounded uppercase ${
                    task.status === "TODO"
                      ? "bg-todo-red text-todo-red-text"
                      : task.status === "INPROGRESS"
                      ? "bg-in-progress-blue text-in-progress-blue-text"
                      : task.status === "REVIEW"
                      ? "bg-review-amber text-review-amber-text"
                      : "bg-completed-green text-completed-green-text"
                  }`}
                >
                  {getTaskStatus(task.status)}
                </div>
              </div>
            </Td>
            <Td>
              <span
                className="flex items-center justify-start gap-2 p-1"
                style={{
                  color:
                    task.priority === "HIGH"
                      ? "red"
                      : task.priority === "MEDIUM"
                      ? "goldenrod"
                      : "green",
                }}
              >
                <TbFlagFilled />{" "}
                {task.priority.charAt(0).toUpperCase() +
                  task.priority.slice(1).toLowerCase()}
              </span>
            </Td>
            <Td>
              <UserAvatarGroup users={task.assignees} />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
function getTaskStatus(status: TaskStatus) {
  switch (status) {
    case "TODO":
      return "To-DO";
    case "INPROGRESS":
      return "In-Progress";
    case "REVIEW":
      return "Review";
    case "COMPLETED":
      return "Completed";
  }
}
