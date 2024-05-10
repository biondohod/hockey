import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserAccount, loginUser } from "../../api/api";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useUserContext } from "../../context/AuthContext";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { QUERY_KEYS } from "./queryKeys";

export const useCreateUserAccount = () => {
  const { setIsAuthenticated } = useUserContext();
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
    onSuccess: (data: AuthFormResponse) => {
      toast.success("Аккаунт успешно создан", {autoClose: 1500});
      localStorage.setItem("token", data.token);
      localStorage.setItem("id", data.id);
      setIsAuthenticated(true);
      // navigate("/");
    },
    onError: (error: AxiosError) => {
      const { message } = error.response?.data as { message?: string };
      if (message) {
        toast.error(`Ошибка при создании аккаунта: ${message}`);
      } else {
        toast.error("Неизвестная ошибка при созданни аккаунта");
      }
    },
  });
};

export const UseLoginUser = () => {
  const { setIsAuthenticated } = useUserContext();
  return useMutation({
    mutationFn: (user: SignInForm) => loginUser(user.email, user.password),
    onSuccess: async (data: AuthFormResponse) => {
      toast.success("Вы успешно вошли в аккаунт", {autoClose: 1500});
      // console.log(data)
      localStorage.setItem("token", data.token);
      localStorage.setItem("id", data.id);
      setIsAuthenticated(true);
      // navigate("/");
    },
    onError: (error: AxiosError) => {
      const { message } = error.response?.data as { message?: string };
      if (message) {
        toast.error(`Ошибка при входе в аккаунт: ${message}`);
      } else {
        toast.error("Неизвестная ошибка при входе в аккаунт");
      }
    },
  });
};
