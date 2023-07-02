import React, { useState } from "react";
import { Task, TaskStatus } from "@prisma/client";
import {
  CheckboxGroup,
  Stack,
  Checkbox,
  Box,
  Table,
  Tbody,
  Td,
  Tr,
  Th,
  Thead,
  Text,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { FaRegClock, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { MdInfoOutline } from "react-icons/md";
import StatusBadge from "../tasks/badges/status-badge";
import { useRouter } from "next/router";
import PriorityBadge from "../tasks/badges/priority-badge";
import DeadlineBadge from "../tasks/badges/deadline-badge";

export interface UpcomingTasksProps {
  tasks: Task[] | undefined;
}

export default function UpcomingTasks({ tasks }: UpcomingTasksProps) {
  const router = useRouter();

  // Checkbox state
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>([
    "TODO",
    "INPROGRESS",
    "REVIEW",
  ]);

  // Filter tasks by selected statuses
  const filteredTasks = tasks?.filter((task) =>
    selectedStatuses.includes(task.status)
  );

  // Sort tasks by deadline
  filteredTasks?.sort(
    (a, b) =>
      new Date(a.endDate as Date).getTime() -
      new Date(b.endDate as Date).getTime()
  );

  return (
    <Box className="flex flex-col w-full gap-4 p-4 bg-white border-2 rounded-lg shadow-lg">
      <h1 className="text-lg font-bold">Upcoming Tasks</h1>
      <div className="flex items-center justify-center gap-2 text-sm">
        Include
        <CheckboxGroup
          value={selectedStatuses}
          onChange={(value) => setSelectedStatuses(value as TaskStatus[])}
        >
          <Stack direction="row">
            <Checkbox
              className="p-1 px-2 text-sm border-2 rounded"
              value="TODO"
            >
              To-do
            </Checkbox>
            <Checkbox
              className="p-1 px-2 text-sm border-2 rounded"
              value="INPROGRESS"
            >
              In-Progress
            </Checkbox>
            <Checkbox
              className="p-1 px-2 text-sm border-2 rounded"
              value="REVIEW"
            >
              Review
            </Checkbox>
            <Checkbox
              className="p-1 px-2 text-sm border-2 rounded"
              value="COMPLETED"
            >
              Completed
            </Checkbox>
          </Stack>
        </CheckboxGroup>
      </div>
      <div className="relative">
        {filteredTasks?.length ? (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                {/* <Th>Status</Th>
                <Th>Priority</Th> */}
                <Th>Due Date</Th>
                <Th>Days Left</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredTasks.map((task, i) => (
                <Tr
                  key={i}
                  onClick={() =>
                    router.push(`/projects/${task.projectId}/tasks/${task.id}`)
                  }
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <Td>{task.name}</Td>
                  {/* <Td>
                    <StatusBadge status={task.status} />
                  </Td>
                  <Td>
                    <PriorityBadge priority={task.priority} />
                  </Td> */}
                  <Td>
                    <div className="flex">
                      <DeadlineBadge deadline={task.endDate as Date} />
                    </div>
                  </Td>
                  <Td>
                    {new Date(task.endDate as Date).getTime() - Date.now() <
                    0 ? (
                      <Flex align="center" color="red.500">
                        <Badge ml={2} colorScheme="red">
                          <span className="flex items-center gap-2 jsutify-center">
                            <FaExclamationTriangle />
                            Overdue
                          </span>
                        </Badge>
                      </Flex>
                    ) : (
                      <Flex align="center" color="green.500">
                        <Badge ml={2} colorScheme="green">
                          <span className="flex items-center gap-2 jsutify-center">
                            <FaCheck />
                            Due in{" "}
                            {Math.ceil(
                              (new Date(task.endDate as Date).getTime() -
                                Date.now()) /
                                (1000 * 3600 * 24)
                            )}{" "}
                            days
                          </span>
                        </Badge>
                      </Flex>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <div>No tasks match the selected statuses.</div>
        )}
      </div>
    </Box>
  );
}
