import {useQuery} from "@tanstack/react-query";
import {getCompetition, getCompetitions, getUser} from "../../api/api";
import {QUERY_KEYS} from "./queryKeys";

export const useGetCurrentUser = (id: string | number | null | undefined, token: string | null) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: () => getUser(id!, token!),
        enabled: !!id && !!token,
    });
}

export const useGetUser = (id: string | number | null | undefined, token: string | null) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, id],
        queryFn: () => getUser(id!, token!),
        enabled: !!id && !!token,
    });
}

export const useGetCompetitions = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_COMPETITIONS],
        queryFn: () => getCompetitions(),
    });
}

export const useGetCompetition = (id: number | undefined) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_COMPETITION_BY_ID, id],
        queryFn: () => getCompetition(id!),
        enabled: id !== undefined && !isNaN(id),
    });
}