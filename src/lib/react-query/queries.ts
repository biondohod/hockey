import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  getCompetition,
  getCompetitionMatches,
  getCompetitionRegistrations,
  getCompetitions,
  getRoles,
  getUser,
} from "../../api/api";
import { QUERY_KEYS } from "./queryKeys";

export const useGetCurrentUser = (
  id: string | number | null | undefined,
  token: string | null
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: () => getUser(id!, token!),
    enabled: !!id && !!token,
    staleTime: 1000 * 60 * 60,
  });
};

export const useGetUser = (
  id: string | number | null | undefined,
  token: string | null
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, id],
    queryFn: () => getUser(id!, token!),
    enabled: !!id && !!token,
    staleTime: 1000 * 60 * 60,
  });
};

export const useGetCompetitions = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COMPETITIONS],
    queryFn: () => getCompetitions(),
    staleTime: 1000 * 60 * 10,
  });
};

export const useGetCompetition = (
  id: number | undefined
): UseQueryResult<ISingleCompetition> => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COMPETITION_BY_ID, id],
    queryFn: () => getCompetition(id!),
    enabled: id !== undefined && !isNaN(id),
    staleTime: 1000 * 60 * 60,
  });
};

export const useGetCompeitionRegistrations = (id: number | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COMPETITION_REGISTRATIONS, id],
    queryFn: () => getCompetitionRegistrations(id!),
    enabled: id !== undefined && !isNaN(id),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetRoles = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ROLES],
    queryFn: () => getRoles(),
    staleTime: 1000 * 60 * 60,
  });
};

export const useGetCompetitionMatches = (
  id: number | undefined,
  offset: number | string = 0,
  limit: number | string = 10
): UseQueryResult<ICompetitionMatches> => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COMPETITION_MATCHES, id],
    queryFn: () => getCompetitionMatches(id!, offset, limit),
    enabled: id !== undefined && !isNaN(id),
    staleTime: 1000 * 60 * 5,
  });
};
