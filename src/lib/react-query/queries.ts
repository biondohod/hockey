import { useInfiniteQuery, useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  getCompetition,
  getCompetitionMatches,
  getCompetitionRegistrations,
  getCompetitions,
  getCompetitionScores,
  getDocumentUrl,
  getRoles,
  getUser,
  getUserDocuments,
  getUserRegistrations,
  getUsersAsAdmin,
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
    // staleTime: 1000 * 60 * 60,
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
    // staleTime: 1000 * 60 * 60,
  });
};

// export const useGetCompetitions = () => {
//   return useInfiniteQuery({
//     queryKey: [QUERY_KEYS.GET_COMPETITIONS],
//     queryFn: getCompetitions as any,
//     getNextPageParam: (lastPage: any) => {
//       // If there's no data, there are no more pages.
//       if (lastPage && lastPage.documents.length === 0) {
//         return null;
//       }

//       // Use the $id of the last document as the cursor.
//       const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
//       return lastId;
//     },
//     initialPageParam: null,
//   });
// };

export const useGetCompetitions =  (offset: number | string = 0, limit: number | string = 10) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COMPETITIONS],
    queryFn: () => getCompetitions(offset, limit),
    // staleTime: Infinity,
  });
};

export const useGetCompetition = (
  id: number | undefined
): UseQueryResult<ISingleCompetition> => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COMPETITION_BY_ID, id],
    queryFn: () => getCompetition(id!),
    enabled: id !== undefined && !isNaN(id),
    // staleTime: 1000 * 60 * 60,
  });
};

export const useGetCompeitionRegistrations = (id: number | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COMPETITION_REGISTRATIONS, id],
    queryFn: () => getCompetitionRegistrations(id!),
    enabled: id !== undefined && !isNaN(id),
    // staleTime: 1000 * 60 * 5,
  });
};

export const useGetRoles = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ROLES],
    queryFn: () => getRoles(),
    // staleTime: 1000 * 60 * 60,
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
    // staleTime: 1000 * 60 * 5,
  });
};

export const useGetUserDocuments = (id: number | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_DOCUMENTS, id],
    queryFn: () => getUserDocuments(id!),
    enabled: id !== undefined && !isNaN(id),
    // staleTime: 1000 * 60 * 60,
  });
};

export const useGetDocumetUrl = (id: number | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_DOCUMENT_URL, id],
    queryFn: () => getDocumentUrl(id!),
    enabled: id !== undefined && !isNaN(id),
    staleTime: Infinity,
  });
};

export const useGetUsersAsAdmin = (
  userId: number | undefined,
  limit: number | string = 10,
  offset: number | string = 0
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS_BY_ROLE_ID, userId],
    queryFn: () => getUsersAsAdmin(userId!, limit, offset),
    enabled: !!userId,
    // staleTime: 1000 * 60 * 5,
  });
};

export const useGetUserRegistrations = (id: number | undefined, offset: number | string = 0, limit: number | string = 10) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_REGISTRATIONS, id],
    queryFn: () => getUserRegistrations(id!, offset, limit),
    enabled: id !== undefined && !isNaN(id),
    // staleTime: 1000 * 60 * 60,
  });
}

export const useGetCompetitionScores = (competitionId: number | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COMPETITION_SCORES, competitionId],
    queryFn: () => getCompetitionScores(competitionId!),
    enabled: competitionId !== undefined && !isNaN(competitionId),
  });
}

export const useGetPlayerMatches = (playerId: number | undefined, offset: number | string = 0, limit: number | string = 10) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PLAYER_MATCHES, playerId],
    queryFn: () => getCompetitionMatches(playerId!, offset, limit),
    enabled: playerId !== undefined && !isNaN(playerId),
  });
}