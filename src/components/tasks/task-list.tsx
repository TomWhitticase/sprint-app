import { Task, TaskStatus, User, TaskPriority } from "@prisma/client";
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
  Select,
  CheckboxGroup,
  Stack,
  Checkbox,
  Text,
  Box,
  Button,
} from "@chakra-ui/react";
import { TbFlagFilled } from "react-icons/tb";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import React, { useState } from "react";
import { useRouter } from "next/router";
import DeadlineBadge from "./badges/deadline-badge";
import UserAvatarGroup from "../users/user-avatar-group";
import { TodoItem } from "./task-card";
import ReactLoading from "react-loading";

export interface TaskListProps {
  tasks: (Task & { assignees: User[] })[] | undefined;
}

export default function TaskList({ tasks }: TaskListProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>([
    "TODO",
    "INPROGRESS",
    "REVIEW",
  ]);
  const [selectedPriorities, setSelectedPriorities] = useState<TaskPriority[]>([
    "LOW",
    "MEDIUM",
    "HIGH",
  ]);
  const [sortAttribute, setSortAttribute] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const filteredTasks = tasks;

  const filteredByStatusTasks = filteredTasks?.filter((task) =>
    selectedStatuses.includes(task.status)
  );

  const filteredByPriorityTasks = filteredByStatusTasks?.filter((task) =>
    selectedPriorities.includes(task.priority)
  );

  const priorityOrder = { LOW: 1, MEDIUM: 2, HIGH: 3 };
  const statusOrder = { TODO: 1, INPROGRESS: 2, REVIEW: 3, COMPLETED: 4 };

  const sortTasks = (a: any, b: any) => {
    if (sortAttribute === "priority") {
      // Use custom sorting for priority
      return sortOrder === "asc"
        ? (priorityOrder as any)[a.priority] -
            (priorityOrder as any)[b.priority]
        : (priorityOrder as any)[b.priority] -
            (priorityOrder as any)[a.priority];
    } else if (sortAttribute === "status") {
      // Use custom sorting for status
      return sortOrder === "asc"
        ? (statusOrder as any)[a.status] - (statusOrder as any)[b.status]
        : (statusOrder as any)[b.status] - (statusOrder as any)[a.status];
    } else if (sortAttribute === "name") {
      // Alphanumeric sort for task name
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortAttribute === "progress") {
      // Numeric sort for progress
      const aProgress = calculateProgress(a.todos);
      const bProgress = calculateProgress(b.todos);
      return sortOrder === "asc"
        ? aProgress - bProgress
        : bProgress - aProgress;
    } else if ((a as any)[sortAttribute] < (b as any)[sortAttribute]) {
      // Standard lexicographic sort for other strings
      return sortOrder === "asc" ? -1 : 1;
    } else if ((a as any)[sortAttribute] > (b as any)[sortAttribute]) {
      return sortOrder === "asc" ? 1 : -1;
    } else {
      // Equal values
      return 0;
    }
  };

  const sortedTasks = [...(filteredByPriorityTasks || [])].sort(sortTasks);

  const router = useRouter();

  return (
    <>
      <div className="flex flex-wrap items-start justify-start w-full gap-2 bg-white border-2 rounded-lg h-18">
        <div className="flex flex-col gap-1 p-2 ">
          <span className="text-xs">Filter by priority</span>

          <CheckboxGroup
            value={selectedPriorities}
            onChange={(value) => setSelectedPriorities(value as TaskPriority[])}
          >
            <Stack direction="row">
              <Checkbox
                bg={"white"}
                className="p-1 px-2 text-sm border-2 rounded"
                value="LOW"
              >
                Low
              </Checkbox>
              <Checkbox
                bg={"white"}
                className="p-1 px-2 text-sm border-2 rounded"
                value="MEDIUM"
              >
                Medium
              </Checkbox>
              <Checkbox
                bg={"white"}
                className="p-1 px-2 text-sm border-2 rounded"
                value="HIGH"
              >
                High
              </Checkbox>
            </Stack>
          </CheckboxGroup>
        </div>
        <div className="flex flex-col gap-1 p-2 ">
          <span className="text-xs">Filter by status</span>
          <CheckboxGroup
            value={selectedStatuses}
            onChange={(value) => setSelectedStatuses(value as TaskStatus[])}
          >
            <Stack direction="row">
              <Checkbox
                bg={"white"}
                className="p-1 px-2 text-sm border-2 rounded"
                value="TODO"
              >
                To-do
              </Checkbox>
              <Checkbox
                bg={"white"}
                className="p-1 px-2 text-sm border-2 rounded"
                value="INPROGRESS"
              >
                In-Progress
              </Checkbox>
              <Checkbox
                bg={"white"}
                className="p-1 px-2 text-sm border-2 rounded"
                value="REVIEW"
              >
                Review
              </Checkbox>
              <Checkbox
                bg={"white"}
                className="p-1 px-2 text-sm border-2 rounded"
                value="COMPLETED"
              >
                Completed
              </Checkbox>
            </Stack>
          </CheckboxGroup>
        </div>
        <div className="flex flex-col gap-1 p-2 ">
          <span className="text-xs">Sort tasks</span>
          <div className="flex gap-2">
            <Select
              size="sm"
              className=""
              bg={"white"}
              onChange={(e) => setSortAttribute(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="endDate">Deadline</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="progress">Progress</option>
            </Select>

            <Button
              size={"sm"}
              className="w-48"
              variant={"black"}
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? (
                <span className="gap-2 flex-center">
                  <FaChevronUp />

                  {"Ascending"}
                </span>
              ) : (
                <span className="gap-2 flex-center">
                  <FaChevronDown />
                  {"Descending"}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Table
        size="sm"
        colorScheme="blackAlpha"
        className="p-4 bg-white border-2"
      >
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
          {sortedTasks === undefined && (
            <div>
              <ReactLoading
                type={"bubbles"}
                color={"#CCC"}
                height={"20%"}
                width={"20%"}
              />
            </div>
          )}
          {sortedTasks?.map((task) => (
            <Tr
              onClick={() => {
                router.push(
                  "/projects/" + task.projectId + "/tasks/" + task.id
                );
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
                    value={calculateProgress(task.todos as any as TodoItem[])}
                    color="green.400"
                  >
                    <CircularProgressLabel>
                      {calculateProgress(
                        task.todos as any as TodoItem[]
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
    </>
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
function calculateProgress(todos: TodoItem[]) {
  const totalTodos = todos ? todos.length : 0;
  const completedTodos = todos
    ? todos.filter((todo) => todo.completed).length
    : 0;
  return totalTodos ? (completedTodos / totalTodos) * 100 : 0; // Progress as a percentage
}
