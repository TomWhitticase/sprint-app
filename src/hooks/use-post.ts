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
//delete post comment
async function deletePostCommentRequest(commentId: string) {
  const { data } = await axios.delete(`/api/posts/comments/${commentId}`);
  return data;
}

//update post
export interface UpdatePostInput {
  title?: string;
  content?: string;
  tags?: string;
}
async function updatePostRequest({
  postId,
  title,
  content,
  tags,
}: UpdatePostInput & { postId: string }) {
  const { data } = await axios.put(
    `/api/posts/${postId}`,
    {
      title,
      content,
      tags,
    },
    {
      withCredentials: true,
    }
  );
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

  const updatePostMutation = useMutation(
    (postDetails: UpdatePostInput) =>
      updatePostRequest({
        ...postDetails,
        postId,
      }),
    {
      onSuccess: (data) => {
        // update the cache with the new post
        //MUST TEST THIS!!!
        queryClient.setQueryData([postId], (oldData: any) => ({
          ...oldData,
          ...data,
        }));
      },
    }
  );

  return {
    post,
    postIsLoading,
    postError,
    updatePost: updatePostMutation.mutateAsync,
    deletePostComment: deletePostCommentMutation.mutateAsync,
    createPostComment: createPostCommentMutation.mutateAsync,
  };
}
