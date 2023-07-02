import { Task, User } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

async function getTasks(projectId: string) {
  const { data } = await axios.get(`/api/projects/${projectId}/tasks`, {
    withCredentials: true,
  });
  return data;
}
async function getAllMyTasks() {
  const { data } = await axios.get(`/api/tasks`, {
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

async function updateTask(taskId: string, updatedData: NewTaskInputs) {
  const { data } = await axios.put(`/api/tasks/${taskId}`, updatedData, {
    withCredentials: true,
  });
  return data;
}

export interface NewTaskInputs {
  name?: string;
  description?: string;
  projectId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  priority?: string;
  assignees?: string[]; // array of User ID
  todos?: JSON; // Use a more specific type depending on the structure of your todos
}
async function createTask(projectId: string, newTask: NewTaskInputs) {
  const { data } = await axios.post(
    `/api/projects/${projectId}/tasks`,
    newTask,
    {
      withCredentials: true,
    }
  );
  return data;
}

export function useTasks(projectId?: string, allMyTasks?: boolean) {
  const queryClient = useQueryClient();
  const tasksQuery = useQuery<
    (Task & {
      assignees: User[];
    })[],
    Error
  >(
    ["tasks", projectId],
    () => (allMyTasks ? getAllMyTasks() : getTasks(projectId!)),
    {
      enabled: !!projectId || allMyTasks,
    }
  );

  const createTaskMutation = useMutation(
    (newTask: NewTaskInputs) => createTask(projectId!, newTask),
    {
      onSuccess: (data) => {
        // Optimistically update the cache with the new task
        queryClient.setQueryData(
          ["tasks", projectId],
          (old: (Task & { assignees: User[] })[] | undefined) => [...old!, data]
        );
      },
    }
  );

  const deleteTaskMutation = useMutation(
    (taskId: string) => deleteTask(taskId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks", projectId]);
      },
    }
  );

  const updateTaskMutation = useMutation(
    (input: { taskId: string; updatedData: NewTaskInputs }) =>
      updateTask(input.taskId, input.updatedData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks", projectId]);
      },
    }
  );

  return {
    tasks: tasksQuery.data,
    tasksIsLoading: tasksQuery.isLoading,
    tasksError: tasksQuery.error,
    createTask: createTaskMutation.mutateAsync,
    createTaskIsLoading: createTaskMutation.isLoading,
    deleteTask: deleteTaskMutation.mutateAsync,
    deleteTaskIsLoading: deleteTaskMutation.isLoading,
    updateTask: updateTaskMutation.mutateAsync,
    updateTaskIsLoading: updateTaskMutation.isLoading,
  };
}
