import { Project, Task } from "@prisma/client";
import axios from "axios";

export interface ClientProject extends Project {
  tasks: Task[];
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
