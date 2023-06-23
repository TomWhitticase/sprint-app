import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";

// Fetch my Invites
async function fetchInvites() {
  const { data } = await axios.get("/api/invites");
  return data;
}

// Fetch project Invites
async function fetchProjectInvites(projectId: string) {
  const { data } = await axios.get(`/api/projects/${projectId}/invites`);
  return data;
}

// Create Invite
export interface CreateInviteInput {
  userId: string;
  projectId: string;
}
async function createInviteRequest(newInvite: CreateInviteInput) {
  const { data } = await axios.post(
    `/api/projects/${newInvite.projectId}/invites`,
    newInvite
  );
  return data;
}

// Accept Invite
async function acceptInvite(inviteId: string) {
  const { data } = await axios.post(`/api/invites/${inviteId}`);
  return data;
}

// Delete Invite
async function deleteInvite(inviteId: string) {
  const { data } = await axios.delete(`/api/invites/${inviteId}`);
  return data;
}

export function useInvites(projectId?: string) {
  const queryClient = useQueryClient();

  const {
    data: invites,
    isLoading: invitesIsLoading,
    error: invitesError,
  } = useQuery(["invites"], fetchInvites);

  const {
    data: projectInvites,
    isLoading: projectInvitesIsLoading,
    error: projectInvitesError,
  } = useQuery([projectId, "invites"], () => fetchProjectInvites(projectId!), {
    enabled: !!projectId,
  });

  const createInviteMutation = useMutation(createInviteRequest, {
    onSuccess: (data) => {
      // update the cache with the new invite
      queryClient.setQueryData(["invites"], (oldData: any) => [
        ...oldData,
        data,
      ]);

      //invaldiate projects
      queryClient.invalidateQueries([projectId, "invites"]);
      //invalidate invites
      queryClient.invalidateQueries(["invites"]);
    },
  });

  const acceptInviteMutation = useMutation(acceptInvite, {
    onSuccess: (data, inviteId) => {
      // update the cache by removing the accepted invite
      queryClient.setQueryData(["invites"], (oldData: any) =>
        oldData.filter((invite: any) => invite.id !== inviteId)
      );

      //invaldiate projects
      queryClient.invalidateQueries(["projects"]);
    },
  });

  const deleteInviteMutation = useMutation(deleteInvite, {
    onSuccess: (data, inviteId) => {
      // update the cache by removing the deleted invite
      queryClient.setQueryData(["invites"], (oldData: any) =>
        oldData.filter((invite: any) => invite.id !== inviteId)
      );

      // invalidate projects
      queryClient.invalidateQueries([projectId, "invites"]);
    },
  });

  return {
    invites,
    projectInvites,
    projectInvitesIsLoading,
    invitesIsLoading,
    invitesError,
    createInvite: createInviteMutation.mutateAsync,
    acceptInvite: acceptInviteMutation.mutateAsync,
    deleteInvite: deleteInviteMutation.mutateAsync,
  };
}
