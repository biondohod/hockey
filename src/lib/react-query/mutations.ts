import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCompetition,
  createUserAccount,
  loginUser,
  updateCompetition,
} from "../../api/api";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useUserContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { QUERY_KEYS } from "./queryKeys";
import i18next from "i18next";

export const useCreateUserAccount = () => {
  const { setIsAuthenticated } = useUserContext();
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
    onSuccess: (data: AuthFormResponse) => {
      toast.success(i18next.t("auth.signUp.success"), { autoClose: 1500 });
      localStorage.setItem("token", data.token);
      localStorage.setItem("id", data.id);
      setIsAuthenticated(true);
      // navigate("/");
    },
    onError: (error: AxiosError) => {
      const { message } = error.response?.data as { message?: string };
      if (message) {
        toast.error(i18next.t("auth.signUp.error", { message }));
      } else {
        toast.error(i18next.t("auth.signUp.unknownError"));
      }
    },
  });
};

export const UseLoginUser = () => {
  const { setIsAuthenticated } = useUserContext();
  return useMutation({
    mutationFn: (user: SignInForm) => loginUser(user.email, user.password),
    onSuccess: async (data: AuthFormResponse) => {
      toast.success(i18next.t("auth.signIn.success"), { autoClose: 1500 });
      // console.log(data)
      localStorage.setItem("token", data.token);
      localStorage.setItem("id", data.id);
      setIsAuthenticated(true);
      // navigate("/");
    },
    onError: (error: AxiosError) => {
      const { message } = error.response?.data as { message?: string };
      if (message) {
        toast.error(i18next.t("auth.signIn.error", { message }));
      } else {
        toast.error(i18next.t("auth.signIn.unknownError"));
      }
    },
  });
};

export const useCreateCompetition = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (competition: IFormattedCompetition) =>
      createCompetition(competition, localStorage.getItem("token")),
    onSuccess: (data: { id: number }) => {
      toast.success("Соревнование успешно создано", { autoClose: 1500 });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMPETITIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMPETITION_BY_ID, data.id],
      });

      navigate(`/competition/${data.id}/info`);
    },
    onError: (error: AxiosError) => {
      const { message } = error.response?.data as { message?: string };
      if (message) {
        toast.error(`Ошибка при создании соревнования: ${message}`);
      } else {
        toast.error("Неизвестная ошибка при создании соревнования");
      }
    },
  });
};

export const useUpdateCompetition = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({
      id,
      competition,
    }: {
      id: number;
      competition: IEditCompetition;
    }) => updateCompetition(id, competition),
    onSuccess: (data: { id: number }) => {
      toast.success("Соревнование успешно обновлено", { autoClose: 1500 });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMPETITIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMPETITION_BY_ID, data.id],
      });
      navigate(`/competition/${data.id}/info`);
    },
    onError: (error: AxiosError) => {
      const { message } = error.response?.data as { message?: string };
      if (message) {
        toast.error(`Ошибка при создании соревнования: ${message}`);
      } else {
        toast.error("Неизвестная ошибка при создании соревнования");
      }
    },
  });
};
