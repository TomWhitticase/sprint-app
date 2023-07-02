import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

export interface TasksAssignedProps {
  count: number | undefined;
}

export default function TasksAssigned({ count }: TasksAssignedProps) {
  const router = useRouter();
  return (
    <div className="flex flex-col w-full p-4 text-white rounded-lg shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600">
      <h1 className="text-lg font-semibold">Tasks Assigned</h1>
      <div className="flex items-center justify-between mt-4">
        <span className="text-5xl font-bold">{count}</span>
        <Button
          size="sm"
          colorScheme="whiteAlpha"
          variant="solid"
          onClick={() => router.push("/tasks")}
        >
          View Tasks
        </Button>
      </div>
    </div>
  );
}
