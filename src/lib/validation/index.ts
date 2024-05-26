import {z} from "zod";

export const SignUpValidation = z
    .object({
        first_name: z
            .string()
            .min(2, {message: "Имя должно содержать минимум 2 символа"})
            .regex(/^[A-Za-zА-Яа-я- ]+$/, "Имя может содержать только буквы"),
        last_name: z
            .string()
            .min(2, {message: "Фамилия должна содержать минимум 2 символа"})
            .regex(/^[A-Za-zА-Яа-я- ]+$/, "Фамилия может содержать только буквы"),
        middle_name: z
            .string()
            .min(2, {message: "Отчество должно содержать минимум 2 символа"})
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
            .refine((telegram) => {
                if (telegram) {
                    return telegram.length >= 6;
                }
                return true;
            }, "Логин в Telegram должен содержать минимум 5 символов"),
        password: z
            .string()
            .min(8, {message: "Пароль должен содержать минимум 8 символов"})
            .refine(
                (password) => /[A-Za-z]/.test(password) && /\d/.test(password),
                "Пароль должен содержать и буквы, и цифры"
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Пароли не совпадают",
        path: ["confirmPassword"],
    });

export const SignInValidation = z.object({
    email: z.string().email("Неверный формат электронной почты"),
    password: z.string(),
});


export const CreateCompetitionValidation = z.object({
    age: z.number({message: "Введите возраст участника в виде числа"}).int().min(14, "Возраст участника не может быть меньше 14 лет"),
    closes_at: z.string(),
    date: z.string(),
    start_time: z.string()
        .nonempty("Укажите время начала турнира"),
    end_time: z.string()
        .nonempty("Укажите время окончания турнира"),
    name: z.string()
        .min(4, "Название турнира должно содержать не менее 4 символов")
        .max(64, "Название турнира не может превышать 64 символа"),
    description: z.string()
        .min(4, "Описание должно содержать не менее 4 символов")
        .max(256, "Описание не может превышать 256 символов")
        .or(z.literal("")),
    tours: z.number({message: "Введите количество туров в виде числа"}).int().positive("Количество туров должно быть больше нуля"),
    size: z.enum(["4", "6"]).transform((val) => parseInt(val, 10)),
}).refine(data => {
    const closes_at = new Date(data.closes_at);
    const today = new Date();
    return closes_at > today;
}, {
    message: "Дата окончания регистрации должна быть позже текущей даты",
    path: ['closes_at']
}).refine(data => {
    const tournamentDate = new Date(data.date);
    const today = new Date();
    return tournamentDate > today;
}, {
    message: "Дата турнира должна быть позже текущей даты",
    path: ['date']
}).refine(data => {
    const closes_at = new Date(data.closes_at);
    const tournamentDate = new Date(data.date);
    return closes_at < tournamentDate;
}, {
    message: "Дата окончания регистрации должна быть раньше даты проведения турнира",
    path: ['closes_at']
}).refine(data => data.start_time < data.end_time, {
    message: "Время окончания турнира не может быть раньше времени его начала",
    path: ['end_time']
});
