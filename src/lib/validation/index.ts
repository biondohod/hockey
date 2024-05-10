import { z } from "zod";

export const SignUpValidation = z
  .object({
    first_name: z
      .string()
      .min(2, { message: "Имя должно содержать минимум 2 символа" })
      .regex(/^[A-Za-zА-Яа-я- ]+$/, "Имя может содержать только буквы"),
    last_name: z
      .string()
      .min(2, { message: "Фамилия должна содержать минимум 2 символа" })
      .regex(/^[A-Za-zА-Яа-я- ]+$/, "Фамилия может содержать только буквы"),
    middle_name: z
      .string()
      .min(2, { message: "Отчество должно содержать минимум 2 символа" })
      .regex(/^[A-Za-zА-Яа-я- ]+$/, "Отчество может содержать только буквы"),
    gender: z.string().nonempty("Пол не может быть пустым"),
    phone: z
    .string()
    .refine(
      (phone) => phone.trim().length === 18,
      "Номер телефона должен содержать 11 цифр"
    ),
    email: z.string().email("Неверный формат электронной почты"),
    birth_date: z
      .string()
      .nonempty("Дата рождения не может быть пустой")
      .refine((date) => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 14;
      }, "Вам должно быть не менее 14 лет"),
      telegram: z
      .string()
      .optional()
      .refine(
        (telegram) => {
          if (telegram) {
            return telegram.length >= 6;
          }
          return true;
        },
        "Логин в Telegram должен содержать минимум 5 символов"
      ),
    password: z
      .string()
      .min(8, { message: "Пароль должен содержать минимум 8 символов" })
      .refine(
        (password) => /[A-Za-z]/.test(password) && /\d/.test(password),
        "Пароль должен содержать и буквы, и цифры"
      ),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export const SignInValidation = z.object({
  email: z.string().email("Неверный формат электронной почты"),
  password: z.string(),
});
