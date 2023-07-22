import { apiService } from "@/services/apiService";
import { Project, Task } from "@prisma/client";
import {
  UseMutateFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { ar } from "date-fns/locale";

// Create Project
export interface CreateProjectInput {
  name: string;
  description?: string;
}
async function createProjectRequest(newProject: CreateProjectInput) {
  const { data } = await axios.post("/api/projects", newProject);
  return data;
}
async function deleteProjectRequest(id: string) {
  const { data } = await axios.delete(`/api/projects/${id}`);
  return data;
}

export function useProjects(role?: "leader" | "member", archived?: boolean) {
  const queryClient = useQueryClient();

  const {
    data: projects,
    isLoading: projectsIsLoading,
    error: projectsError,
  } = useQuery(["projects", role, archived], () =>
    // fetchProjects(role, archived)
    apiService.projects.getProjects({ role, archived })
  );

  const createProjectMutation = useMutation(createProjectRequest, {
    onSuccess: (data) => {
      // update the cache with the new project
      queryClient.setQueryData(["projects"], (oldData: any) => [
        ...oldData,
        data,
      ]);
    },
  });

  const deleteProjectMutation = useMutation(deleteProjectRequest, {
    onSuccess: (data) => {
      // update the cache with the new project
      queryClient.setQueryData(["projects"], (oldData: any) =>
        oldData.filter((project: Project) => project.id !== data.id)
      );
    },
  });

  return {
    projects,
    projectsIsLoading,
    projectsError,
    createProject: createProjectMutation.mutateAsync,
    deleteProject: deleteProjectMutation.mutateAsync,
  };
}
