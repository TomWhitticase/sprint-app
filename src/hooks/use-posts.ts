import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

//fetch posts
async function fetchPosts(projectId: string) {
  const { data } = await axios.get(`/api/projects/${projectId}/posts`, {
    withCredentials: true,
  });
  return data;
}

// Create post
export interface CreatePostInput {
  title: string;
  content: string;
  tags: string;
  projectId: string;
}
async function createPostRequest(newPost: CreatePostInput) {
  const { data } = await axios.post(
    `/api/projects/${newPost.projectId}/posts`,
    newPost
  );
  return data;
}

export function usePosts(projectId: string) {
  const queryClient = useQueryClient();

  const {
    data: posts,
    isLoading: postsIsLoading,
    error: postsError,
  } = useQuery([projectId, "posts"], () => fetchPosts(projectId));

  const createPostMutation = useMutation(createPostRequest, {
    onSuccess: (data) => {
      // update the cache with the new project
      queryClient.setQueryData([projectId, "posts"], (oldData: any) => [
        ...oldData,
        data,
      ]);
    },
  });

  return {
    posts,
    postsIsLoading,
    postsError,
    createPost: createPostMutation.mutateAsync,
  };
}
