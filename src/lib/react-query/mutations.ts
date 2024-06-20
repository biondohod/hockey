import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  cancelRegistration,
  createCompetition,
  createUserAccount,
  deleteDocument,
  deleteUser,
  editMatchScore,
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
import { useTranslation } from "react-i18next";
import { LogOutUser } from "../utils";

const UNVERIFIED_USER_ROLE_ID = 3;

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
  const { setIsAuthenticated, checkAuthUser } = useUserContext();
  return useMutation({
    mutationFn: (user: SignInForm) => loginUser(user.email, user.password),
    onSuccess: async (data: AuthFormResponse) => {
      toast.success(i18next.t("auth.signIn.success"), { autoClose: 1500 });
      console.log(data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("id", data.id);
      // let token = localStorage.getItem("token");
      // let id = localStorage.getItem("id");
      // console.log(token, id);
      setIsAuthenticated(true);
      // checkAuthUser();
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
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (competition: IFormattedCompetition) =>
      createCompetition(competition, localStorage.getItem("token")),
    onSuccess: (data: { id: number }) => {
      toast.success(t("competitions.createCompetiton.success"), {
        autoClose: 1500,
      });
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
        toast.error(t("competitions.createCompetiton.error", { message }));
      } else {
        toast.error(t("competitions.createCompetition.unknownError"));
      }
    },
  });
};

export const useUpdateCompetition = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({
      id,
      competition,
    }: {
      id: number;
      competition: IEditCompetition;
    }) => updateCompetition(id, competition).then(() => ({ id })),
    onSuccess: (data: { id: number }) => {
      toast.success(t("competitions.editCompetition.success"), {
        autoClose: 1500,
      });
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
        toast.error(t("competition.editCompetition.error", { message }));
      } else {
        toast.error(t("competition.editCompetition.unknownError"));
      }
    },
  });
};

export const useRegisterForCompetition = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { user } = useUserContext();
  return useMutation({
    mutationFn: (id: number) => registerForCompetition(id),
    onSuccess: (_, competitionId) => {
      toast.success(t("competitions.register.success"), {
        autoClose: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMPETITION_REGISTRATIONS, competitionId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_REGISTRATIONS, user?.id],
      });
    },
    onError: (error: AxiosError) => {
      const { message } = error.response?.data as { message?: string };
      if (message) {
        toast.error(t("competitions.register.error", { message }));
      } else {
        toast.error(t("competitions.register.unknownError"));
      }
    },
  });
};

export const useCancelRegistration = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { user } = useUserContext();
  return useMutation({
    mutationFn: (id: number) => cancelRegistration(id),
    onSuccess: (_, competitoinId) => {
      toast.success(t("competitions.register.cancelSuccess"), {
        autoClose: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMPETITION_REGISTRATIONS, competitoinId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_REGISTRATIONS, user?.id],
      });
    },
    onError: (error: AxiosError) => {
      const { message } = error.response?.data as { message?: string };
      if (message) {
        toast.error(t("competitions.register.cancelError", { message }));
      } else {
        toast.error(t("competitions.register.cancelUnknownError"));
      }
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (user: INewUser | IEditUser) => updateProfile(user),
    onSuccess: () => {
      toast.success(t("profile.editProfile.success"), { autoClose: 1500 });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      navigate(`/profile/${user?.id}`);
    },
    onError: (error: AxiosError) => {
      const { message } = error.response?.data as { message?: string };
      if (message) {
        toast.error(t("profile.editProfile.error", { message }));
      } else {
        toast.error(t("profile.editProfile.unknownError"));
      }
    },
  });
};

export const useUpdateProfileAsAdmin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({
      id,
      user,
      isNavigateAfterSuccess = true,
    }: {
      id: number | string;
      user: IEditUser;
      isNavigateAfterSuccess?: boolean;
    }) =>
      updateProfileAsAdmin(id, user).then(() => ({
        id,
        user,
        isNavigateAfterSuccess,
      })),
    onSuccess: (data: {
      id: number | string;
      user: IEditUser;
      isNavigateAfterSuccess: boolean;
    }) => {
      toast.success(t("profile.editProfile.success"), { autoClose: 1500 });
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
        toast.error(t("profile.editProfile.error", { message }));
      } else {
        toast.error(t("profile.editProfile.unknownError"));
      }
    },
  });
};

export const useUpdateRegistration = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
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
    onSuccess: (data, variables) => {
      toast.success(t("competitions.registration.success"), {
        autoClose: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.GET_COMPETITION_REGISTRATIONS,
          data.competitionId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_REGISTRATIONS, variables.playerId],
      });
    },
    onError: (error: AxiosError) => {
      const { message } = error.response?.data as { message?: string };
      if (message) {
        toast.error(t("competitions.registration.error", { message }));
      } else {
        toast.error(t("competitions.registration.unknownError"));
      }
    },
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  const { user } = useUserContext();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (document: DocumentForm) => uploadDocument(document),
    onSuccess: () => {
      toast.success(t("profile.documents.success"), { autoClose: 1500 });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_DOCUMENTS, user?.id],
      });
    },
    onError: (error: AxiosError) => {
      const { message } = error.response?.data as { message?: string };
      if (message) {
        toast.error(t("profile.documents.error", { message }));
      } else {
        toast.error(t("profile.documents.unknownError"));
      }
    },
  });
};

export const useCreateUserAsAdmin = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (user: IEditUser) => createUserAccount(user),
    onSuccess: (data) => {
      toast.success(t("auth.signUp.success"), { autoClose: 1500 });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USERS_BY_ROLE_ID, UNVERIFIED_USER_ROLE_ID],
      });
      navigate(`/profile/${data.id}`);
    },
    onError: (error: AxiosError) => {
      const { message } = error.response?.data as { message?: string };
      if (message) {
        toast.error(t("auth.signUp.error", { message }));
      } else {
        toast.error(t("auth.signUp.unknownError"));
      }
    },
  });
};

export const useDeleteUser = () => {
  const { t } = useTranslation();
  const logOut = LogOutUser(false);
  return useMutation({
    mutationFn: () => deleteUser(),
    onSuccess: () => {
      toast.success(t("profile.delete.success"), { autoClose: 1500 });
      logOut();
    },
    onError: (error: AxiosError) => {
      const { message } = error.response?.data as { message?: string };
      if (message) {
        toast.error(t("profile.delete.error", { message }));
      } else {
        toast.error(t("profile.delete.unknownError"));
      }
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (documentId: number) =>
      deleteDocument(documentId).then(() => documentId),
    onSuccess: (documentId: number) => {
      toast.success(t("profile.documents.delete.success"), { autoClose: 1500 });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_DOCUMENTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_DOCUMENT_URL, documentId],
      });
    },
    onError: (error: AxiosError) => {
      const { message } = error.response?.data as { message?: string };
      if (message) {
        toast.error(t("profile.documents.delete.error", { message }));
      } else {
        toast.error(t("profile.documents.delete.unknownError"));
      }
    },
  });
};

export const useEditMatchScore = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({
      competitionId,
      matchId,
      leftScore,
      rightScore,
    }: {
      competitionId: number;
      matchId: number;
      leftScore: number;
      rightScore: number;
    }) => editMatchScore(competitionId, matchId, leftScore, rightScore),
    onSuccess: (_, values) => {
      toast.success(t("competitions.schedule.editScore.success"), {
        autoClose: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMPETITION_MATCHES, values.competitionId],
      });
    },
    onError: (error: AxiosError) => {
      const { message } = error.response?.data as { message?: string };
      if (message) {
        toast.error(t("competitions.schedule.editScore.error", { message }));
      } else {
        toast.error(t("competitions.schedule.editScore.unknownError"));
      }
    },
  });
};
