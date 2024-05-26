import { useForm } from "react-hook-form";
import { CreateCompetitionValidation } from "../../../lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useCreateCompetition } from "../../../lib/react-query/mutations";

const CreateCompetition = () => {
  const { mutateAsync, isPending } = useCreateCompetition();

  const { register, handleSubmit } = useForm<
    z.infer<typeof CreateCompetitionValidation>
  >({
    resolver: zodResolver(CreateCompetitionValidation),
    defaultValues: {
      age: 0,
      closes_at: "",
      days: [
        {
          date: "",
          end_time: "",
          start_time: "",
        },
      ],
      description: "",
      name: "",
      size: 0,
      tours: 0,
    },
  });

  const onSubmit = async (data: ICompetition) => {
    toast.promise(mutateAsync(data), {
      pending: "Создание турнира",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth__form">
      {/* <label htmlFor="phone" className="auth__label">
        Почта
        <input
          type="email"
          id="phone"
          className="auth__input"
          {...register("email")}
          required={true}
          autoComplete="off"
        />
      </label>

      <label htmlFor="password" className="auth__label">
        Пароль
        <input
          type="password"
          id="password"
          className="auth__input"
          {...register("password")}
          placeholder="Введите ваш пароль"
        />
      </label> */}
      {/* <div className="auth__checkbox">
      <input type="checkbox" name="rememberme" id="rememberme" />
      <label htmlFor="rememberme">Сохранить вход</label>
    </div> */}
      {/* <button type="submit" className="auth__submit" disabled={isPending}>
        Вход
      </button> */}
    </form>
  );
};

export default CreateCompetition;
