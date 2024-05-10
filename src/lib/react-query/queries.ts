import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../api/api";
import { QUERY_KEYS } from "./queryKeys";

export const useGetUser = (id: string | number | null, token: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: () => getUser(id!, token!),
    enabled: !!id && !!token,
  });
}