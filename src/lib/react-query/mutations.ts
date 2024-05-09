import { useMutation } from "@tanstack/react-query"
import { createUserAccount, loginUser } from "../../api/api"
import { toast } from "react-toastify";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
    onSuccess: (data: AuthFormResponse) => {
      toast.success("Аккаунт создан");
      localStorage.setItem("token", data.token);
      localStorage.setItem("id", data.id);
    },
    onError: (error: any) => {
      toast.error(`Ошибка при создании аккаунта: ${error.message}`);
    },
  })
}

export const UseLoginUser = () => {
  return useMutation({
    mutationFn: (user: SignInForm) => loginUser(user.email, user.password),
    onSuccess: (data: AuthFormResponse) => {
      toast.success("Вы успешно вошли в аккаунт");
      // console.log(data)
      localStorage.setItem("token", data.token);
      localStorage.setItem("id", data.id);
    },
    onError: (error: any) => {
      toast.error(`Ошибка при входе в аккаунт: ${error.message}`);
    },
  })
}
