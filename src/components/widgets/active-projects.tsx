import { useProjects } from "@/hooks/use-projects";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

export default function ActiveProjects() {
  const router = useRouter();
  const { projects } = useProjects();
  return (
    <div className="flex flex-col w-full p-4 text-white rounded-lg shadow-lg bg-gradient-to-br from-orange-500 to-red-600">
      <h1 className="text-lg font-semibold">Active Projects</h1>
      <div className="flex items-center justify-between mt-4">
        <span className="text-5xl font-bold">{projects?.length}</span>
        <Button
          onClick={() => router.push("/projects")}
          size="sm"
          colorScheme="whiteAlpha"
          variant="solid"
        >
          View Projects
        </Button>
      </div>
    </div>
  );
}
