import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  cancelRegistration,
  createCompetition,
  createUserAccount,
  loginUser,
  registerForCompetition,
  updateCompetition,
  updateProfile,
  updateProfileAsAdmin,
  updateRegistration,
  uploadDocument,
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
    }) => updateCompetition(id, competition).then(() => ({ id })),
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

export const useRegisterForCompetition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => registerForCompetition(id).then(() => ({ id })),
    onSuccess: (data) => {
      toast.success("Вы успешно зарегистрировались на соревнование", {
        autoClose: 1500,
      });
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMPETITION_REGISTRATIONS, data.id],
      });
    },
    onError: (error: AxiosError) => {
      const { message } = error.response?.data as { message?: string };
      if (message) {
        toast.error(`Ошибка при регистрации на соревнование: ${message}`);
      } else {
        toast.error("Неизвестная ошибка при регистрации на соревнование");
      }
    },
  });
};

export const useCancelRegistration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cancelRegistration(id).then(() => ({ id })),
    onSuccess: (data) => {
      toast.success("Вы успешно отменили регистрацию на соревнование", {
        autoClose: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMPETITION_REGISTRATIONS, data.id],
      });
    },
    onError: (error: AxiosError) => {
      const { message } = error.response?.data as { message?: string };
      if (message) {
        toast.error(
          `Ошибка при отмене регистрации на соревнование: ${message}`
        );
      } else {
        toast.error(
          "Неизвестная ошибка при отмене регистрации на соревнование"
        );
      }
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useUserContext();
  return useMutation({
    mutationFn: (user: INewUser | IEditUser) => updateProfile(user),
    onSuccess: () => {
      toast.success("Профиль успешно обновлен", { autoClose: 1500 });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      navigate(`/profile/${user?.id}`);
    },
    onError: (error: AxiosError) => {
      const { message } = error.response?.data as { message?: string };
      if (message) {
        toast.error(`Ошибка при обновлении профиля: ${message}`);
      } else {
        toast.error("Неизвестная ошибка при обновлении профиля");
      }
    },
  });
};

export const useUpdateProfileAsAdmin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({
      id,
      user,
      isNavigateAfterSuccess = true,
    }: {
      id: number | string;
      user: IEditUser;
      isNavigateAfterSuccess: boolean;
    }) => updateProfileAsAdmin(id, user).then(() => ({ id, user, isNavigateAfterSuccess })),
    onSuccess: (data: { id: number | string; user: IEditUser, isNavigateAfterSuccess: boolean }) => {
      toast.success("Профиль успешно обновлен", { autoClose: 1500 });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data.id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USERS_BY_ROLE_ID, data.user?.role_id],
      });
      if (data.isNavigateAfterSuccess) {
        navigate(`/profile/${data.id}`);
      }
    },
    onError: (error: AxiosError) => {
      const { message } = error.response?.data as { message?: string };
      if (message) {
        toast.error(`Ошибка при обновлении профиля: ${message}`);
      } else {
        toast.error("Неизвестная ошибка при обновлении профиля");
      }
    },
  });
};

export const useUpdateRegistration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      playerId,
      competitionId,
      data,
    }: {
      playerId: number;
      competitionId: number;
      data: IUpdateRegistration;
    }) =>
      updateRegistration(playerId, competitionId, data).then(() => ({
        competitionId,
      })),
    onSuccess: (data) => {
      toast.success("Регистрация успешно обновлена", { autoClose: 1500 });
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.GET_COMPETITION_REGISTRATIONS,
          data.competitionId,
        ],
      });
    },
    onError: (error: AxiosError) => {
      const { message } = error.response?.data as { message?: string };
      if (message) {
        toast.error(`Ошибка при обновлении регистрации: ${message}`);
      } else {
        toast.error("Неизвестная ошибка при обновлении регистрации");
      }
    },
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  const { user } = useUserContext();
  return useMutation({
    mutationFn: (document: DocumentForm) => uploadDocument(document),
    onSuccess: () => {
      toast.success("Документ успешно загружен", { autoClose: 1500 });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_DOCUMENTS, user?.id],
      });
    },
    onError: (error: AxiosError) => {
      const { message } = error.response?.data as { message?: string };
      if (message) {
        toast.error(`Ошибка при загрузке документа: ${message}`);
      } else {
        toast.error("Неизвестная ошибка при загрузке документа");
      }
    },
  });
};
