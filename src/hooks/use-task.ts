import { Task, TaskComment, User } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

async function getTask(taskId: string) {
  const { data } = await axios.get(`/api/tasks/${taskId}`, {
    withCredentials: true,
  });
  return data;
}

async function deleteTask(taskId: string) {
  const { data } = await axios.delete(`/api/tasks/${taskId}`, {
    withCredentials: true,
  });
  return data;
}

async function createTaskComment(taskId: string, content: string) {
  const { data } = await axios.post(
    `/api/tasks/${taskId}/comments`,
    { content },
    {
      withCredentials: true,
    }
  );
  return data;
}

async function deleteTaskComment(taskId: string, commentId: string) {
  const { data } = await axios.delete(
    `/api/tasks/${taskId}/comments/${commentId}`,
    {
      withCredentials: true,
    }
  );
  return data;
}

export interface UpdateTaskInputs {
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  priority?: string;
  assigneeIds?: string[]; // array of User ID
  todos?: any; // Use a more specific type depending on the structure of your todos
}
async function updateTask(taskId: string, updatedData: UpdateTaskInputs) {
  // Update with actual endpoint when available
  const { data } = await axios.put(`/api/tasks/${taskId}`, updatedData, {
    withCredentials: true,
  });
  return data;
}

export function useTask(taskId?: string) {
  const queryClient = useQueryClient();

  const taskQuery = useQuery<
    Task & {
      assignees: User[];
      comments: (TaskComment & { user: User })[];
    },
    Error
  >(["task", taskId], () => getTask(taskId!), {
    enabled: !!taskId,
  });

  const deleteTaskMutation = useMutation(() => deleteTask(taskId!), {
    onSuccess: () => {
      queryClient.invalidateQueries(["task", taskId]);
    },
  });

  const createTaskCommentMutation = useMutation(
    (content: string) => createTaskComment(taskId!, content),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["task", taskId]);
      },
    }
  );

  const deleteTaskCommentMutation = useMutation(
    (commentId: string) => deleteTaskComment(taskId!, commentId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["task", taskId]);
      },
    }
  );

  const updateTaskMutation = useMutation(
    (updatedData: UpdateTaskInputs) => updateTask(taskId!, updatedData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["task", taskId]);
      },
    }
  );

  return {
    task: taskQuery.data,
    taskIsLoading: taskQuery.isLoading,
    taskError: taskQuery.error,
    deleteTask: deleteTaskMutation.mutateAsync,
    deleteTaskIsLoading: deleteTaskMutation.isLoading,
    updateTask: updateTaskMutation.mutateAsync,
    updateTaskIsLoading: updateTaskMutation.isLoading,
    createTaskComment: createTaskCommentMutation.mutateAsync,
    createTaskCommentIsLoading: createTaskCommentMutation.isLoading,
    deleteTaskComment: deleteTaskCommentMutation.mutateAsync,
    deleteTaskCommentIsLoading: deleteTaskCommentMutation.isLoading,
  };
}
