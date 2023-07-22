import { ClientProject } from "@/services/apiService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Fetch Project
async function fetchProject(id: string) {
  const { data } = await axios.get(`/api/projects/${id}`);
  return data;
}

// Delete Project
async function deleteProjectRequest(id: string) {
  const { data } = await axios.delete(`/api/projects/${id}`);
  return data;
}

// Remove User from Project
async function removeUserFromProjectRequest({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  const { data } = await axios.delete(
    `/api/projects/${projectId}/members/${userId}`
  );
  return data;
}

//Update project details
async function updateProjectRequest({
  projectId,
  name,
  description,
  archived,
}: {
  projectId: string;
  name?: string;
  description?: string;
  archived?: boolean;
}) {
  const { data } = await axios.put(
    `/api/projects/${projectId}`,
    {
      name,
      description,
      archived,
    },
    {
      withCredentials: true,
    }
  );
  return data;
}

export function useProject(id: string) {
  const queryClient = useQueryClient();

  const {
    data: project,
    isLoading: projectIsLoading,
    error: projectError,
  } = useQuery<ClientProject>(["project", id], () => fetchProject(id));

  const deleteProjectMutation = useMutation(deleteProjectRequest, {
    onSuccess: (data) => {
      // invalidate the project query after deleting
      queryClient.invalidateQueries(["projects"]);
    },
  });

  const removeUserFromProjectMutation = useMutation(
    removeUserFromProjectRequest,
    {
      onSuccess: (data) => {
        // invalidate the project query after removing a user
        queryClient.invalidateQueries(["project", id]);
      },
    }
  );

  const updateProjectMutation = useMutation(updateProjectRequest, {
    onSuccess: (data) => {
      // invalidate the project query after updating
      queryClient.invalidateQueries(["project", id]);
    },
  });

  return {
    project,
    projectIsLoading,
    projectError,
    deleteProject: deleteProjectMutation.mutateAsync,
    removeUserFromProject: removeUserFromProjectMutation.mutateAsync,
    updateProject: updateProjectMutation.mutateAsync,
  };
}
