import { useProjects } from "@/hooks/use-projects";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import ReactLoading from "react-loading";
import React from "react";
import { useSession } from "next-auth/react";

export default function ActiveProjects() {
  const router = useRouter();
  const { projects } = useProjects();
  const { data: session } = useSession();
  return (
    <div className="flex flex-col w-full p-4 text-white rounded-lg shadow-lg bg-gradient-to-br from-orange-500 to-red-600">
      <h1 className="text-lg font-semibold">My Active Projects</h1>
      <div className="flex items-center justify-between h-12 mt-4">
        <span className="text-5xl font-bold">
          {projects ? (
            <span>
              {projects?.length}{" "}
              <span className="text-sm font-semibold">
                leader of{" "}
                {
                  projects?.filter(
                    ({ leaderId }) => leaderId === session?.user.id
                  ).length
                }
              </span>
            </span>
          ) : (
            <ReactLoading type="bubbles" color="white" height={32} width={32} />
          )}
        </span>
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
