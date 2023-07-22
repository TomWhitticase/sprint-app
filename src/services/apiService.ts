import { Post, Project, Resource, Task, User } from "@prisma/client";
import axios from "axios";

export interface ClientProject extends Project {
  tasks: Task[];
  members: User[];
  leader: User;
  posts: Post[];
  resources: Resource[];
}

export const apiService = {
  projects: {
    getProjects: async ({
      archived,
      role,
    }: {
      archived?: boolean;
      role?: "leader" | "member";
    }): Promise<ClientProject[]> => {
      if (archived) {
        const { data } = await axios.get(`/api/projects/archived`, {
          withCredentials: true,
        });
        return data;
      }
      const { data } = await axios.get(`/api/projects?role=${role}`, {
        withCredentials: true,
      });
      return data;
    },
  },
};
