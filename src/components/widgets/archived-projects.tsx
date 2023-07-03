import { useProjects } from "@/hooks/use-projects";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import ReactLoading from "react-loading";
import React from "react";

export default function ArchivedProjects() {
  const router = useRouter();
  const { projects } = useProjects(undefined, true);
  return (
    <div className="flex flex-col w-full p-4 text-white rounded-lg shadow-lg bg-gradient-to-br from-yellow-500 to-amber-600">
      <h1 className="text-lg font-semibold">Archived Projects</h1>
      <div className="flex items-center justify-between h-12 mt-4">
        <span className="text-5xl font-bold">
          {projects ? (
            projects.length
          ) : (
            <ReactLoading type="bubbles" color="white" height={32} width={32} />
          )}
        </span>
        <Button
          onClick={() => router.push("/archive")}
          size="sm"
          colorScheme="whiteAlpha"
          variant="solid"
        >
          View Archive
        </Button>
      </div>
    </div>
  );
}
