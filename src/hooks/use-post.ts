import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

//fetch post
async function fetchPost(postId: string) {
  const { data } = await axios.get(`/api/posts/${postId}`, {
    withCredentials: true,
  });
  return data;
}
//create post comment
export interface CreatePostCommentInput {
  content: string;
  parentCommentId?: string;
  postId: string;
}
async function createPostCommentRequest(
  newPostComment: CreatePostCommentInput
) {
  const { data } = await axios.post(
    `/api/posts/${newPostComment.postId}/comments`,
    newPostComment
  );
  return data;
}

async function deletePostCommentRequest(commentId: string) {
  const { data } = await axios.delete(`/api/posts/comments/${commentId}`);
  return data;
}

export function usePost(postId: string) {
  const queryClient = useQueryClient();

  const {
    data: post,
    isLoading: postIsLoading,
    error: postError,
  } = useQuery([postId], () => fetchPost(postId));

  const createPostCommentMutation = useMutation(createPostCommentRequest, {
    onSuccess: (data) => {
      // update the cache with the new post comments
      queryClient.invalidateQueries([postId]);
    },
  });

  const deletePostCommentMutation = useMutation(deletePostCommentRequest, {
    onSuccess: (data) => {
      // update the cache with the new post comments
      queryClient.invalidateQueries([postId]);
    },
  });

  return {
    post,
    postIsLoading,
    postError,
    deletePostComment: deletePostCommentMutation.mutateAsync,
    createPostComment: createPostCommentMutation.mutateAsync,
  };
}
