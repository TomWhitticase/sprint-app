import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const fetchUsers = async (
  page: number,
  limit: number,
  search_query: string,
  exclude: string[]
) => {
  const response = await axios.get("/api/users", {
    params: { page, limit, search_query, exclude: exclude.join(",") },
  });

  if (response.status !== 200) {
    throw new Error("Error fetching users");
  }

  return response.data;
};

export function useUsers(
  page = 1,
  limit = 10,
  search_query = "",
  exclude = []
) {
  const { data, isLoading, isError, error } = useQuery(
    ["users", page, limit, search_query, exclude],
    () => fetchUsers(page, limit, search_query, exclude),
    {
      keepPreviousData: true, // This option allows you to keep the old data when a new page is fetched, helping to prevent abrupt UI transition.
    }
  );
  return {
    users: data,
    usersIsLoading: isLoading,
    usersIsError: isError,
    usersError: error,
  };
}
