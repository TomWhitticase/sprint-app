import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Fetch Resources
async function fetchResources(projectId: string) {
  const { data } = await axios.get(`/api/projects/${projectId}/resources`);
  return data;
}

// Delete Resource
async function deleteResourceRequest(resourceId: string) {
  const { data } = await axios.delete(`/api/resources/${resourceId}`);
  return data;
}

export interface UpdateResourceInput {
  resourceId: string;
  name?: string;
  description?: string;
  url?: string;
  icon?: string;
}
//Update resource details
async function updateResourceRequest({
  resourceId,
  name,
  description,
  url,
  icon,
}: UpdateResourceInput) {
  const { data } = await axios.put(
    `/api/resources/${resourceId}`,
    {
      name,
      description,
      url,
      icon,
    },
    {
      withCredentials: true,
    }
  );
  return data;
}

// Create Resource
export interface CreateResourceInput {
  name: string;
  description?: string;
  url: string;
  icon: string;
}

async function createResourceRequest(
  projectId: string,
  newResource: CreateResourceInput
) {
  const { data } = await axios.post(
    `/api/projects/${projectId}/resources`,
    newResource
  );
  return data;
}

export function useResources(projectId: string) {
  const queryClient = useQueryClient();

  const {
    data: resources,
    isLoading: resourcesIsLoading,
    error: resourcesError,
  } = useQuery(["resources", projectId], () => fetchResources(projectId));

  const createResourceMutation = useMutation(
    (newResource: CreateResourceInput) =>
      createResourceRequest(projectId, newResource),
    {
      onSuccess: (data) => {
        // update the cache with the new resource
        queryClient.setQueryData(["resources", projectId], (oldData: any) => [
          ...oldData,
          data,
        ]);
      },
    }
  );

  const deleteResourceMutation = useMutation(deleteResourceRequest, {
    onSuccess: () => {
      // invalidate and refetch the resources
      queryClient.invalidateQueries(["resources", projectId]);
    },
  });

  const updateResourceMutation = useMutation(updateResourceRequest, {
    onSuccess: () => {
      // invalidate and refetch the resources
      queryClient.invalidateQueries(["resources", projectId]);
    },
  });

  return {
    resources,
    resourcesIsLoading,
    resourcesError,
    updateResource: updateResourceMutation.mutateAsync,
    createResource: createResourceMutation.mutateAsync,
    deleteResource: deleteResourceMutation.mutateAsync,
  };
}
