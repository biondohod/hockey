import { z } from "zod";

export const SignUpValidation = z
  .object({
    first_name: z
      .string()
      .min(2, { message: "auth.validation.first_name.min" })
      .regex(/^[A-Za-zА-Яа-я- ]+$/, "auth.validation.first_name.regex"),
    last_name: z
      .string()
      .min(2, { message: "auth.validation.last_name.min" })
      .regex(/^[A-Za-zА-Яа-я- ]+$/, "auth.validation.last_name.regex"),
    middle_name: z
      .string()
      .min(2, { message: "auth.validation.middle_name.min" })
      .regex(/^[A-Za-zА-Яа-я- ]+$/, "auth.validation.middle_name.regex"),
    gender: z.string().nonempty("auth.validation.gender"),
    phone: z
      .string()
      .refine(
        (phone) => /^\+\d \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone),
        "auth.validation.phone"
      ),
    // .refine((phone) => phone.trim().length === 18, "auth.validation.phone"),
    email: z.string().email("auth.validation.email"),
    birth_date: z
      .string()
      .nonempty("auth.validation.birth_date.nonempty")
      .refine((date) => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >=3 && age <= 100;
      }, "auth.validation.birth_date.age"),
    telegram: z.string().min(6, { message: "auth.validation.telegram" }),
    password: z
      .string()
      .min(8, { message: "auth.validation.password.min" })
      .refine(
        (password) => /[A-Za-z]/.test(password) && /\d/.test(password),
        "auth.validation.password.refine"
      ),
    confirmPassword: z.string(),
    role_id: z.string().optional(),
    position: z.string().nonempty(),
    preparation: z.string().nonempty(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "auth.validation.confirmPassword",
    path: ["confirmPassword"],
  });

export const EditProfileValidation = z
  .object({
    first_name: z
      .string()
      .min(2, { message: "auth.validation.first_name.min" })
      .regex(/^[A-Za-zА-Яа-я- ]+$/, "auth.validation.first_name.regex"),
    last_name: z
      .string()
      .min(2, { message: "auth.validation.last_name.min" })
      .regex(/^[A-Za-zА-Яа-я- ]+$/, "auth.validation.last_name.regex"),
    middle_name: z
      .string()
      .min(2, { message: "auth.validation.middle_name.min" })
      .regex(/^[A-Za-zА-Яа-я- ]+$/, "auth.validation.middle_name.regex"),
    gender: z.string().nonempty("auth.validation.gender"),
    position: z.string().nonempty(),
    preparation: z.string().nonempty(),
    phone: z
      .string()
      .refine(
        (phone) =>
          /^\+\d \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone) ||
          /^\+\d{11}$/.test(phone),
        "auth.validation.phone"
      ),
    email: z.string().email("auth.validation.email"),
    birth_date: z
      .string()
      .nonempty("auth.validation.birth_date.nonempty")
      .refine((date) => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >=3 && age <= 100;
      }, "auth.validation.birth_date.age"),
    telegram: z
      .string()
      .optional()
      .refine((telegram) => {
        if (telegram) {
          return telegram.length >= 6;
        }
        return true;
      }, "auth.validation.telegram"),
    changePassword: z.boolean(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    role_id: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.changePassword) {
        return (
          data.password &&
          data.password.length >= 8 &&
          /[A-Za-z]/.test(data.password) &&
          /\d/.test(data.password) &&
          data.password === data.confirmPassword
        );
      }
      return true;
    },
    {
      message: "auth.validation.password",
      path: ["password"],
    }
  );

export const SignInValidation = z.object({
  email: z.string().email("auth.validation.email"),
  password: z.string().min(1),
});

export const CreateUserValidation = z
  .object({
    first_name: z
      .string()
      .min(2, { message: "auth.validation.first_name.min" })
      .regex(/^[A-Za-zА-Яа-я- ]+$/, "auth.validation.first_name.regex"),
    last_name: z
      .string()
      .min(2, { message: "auth.validation.last_name.min" })
      .regex(/^[A-Za-zА-Яа-я- ]+$/, "auth.validation.last_name.regex"),
    middle_name: z
      .string()
      .min(2, { message: "auth.validation.middle_name.min" })
      .regex(/^[A-Za-zА-Яа-я- ]+$/, "auth.validation.middle_name.regex"),
    gender: z.string().optional(),
    phone: z
      .string()
      .optional()
      .refine(
        (phone) =>
          phone === undefined ||
          /^\+\d \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone),
        "auth.validation.phone"
      ),
    // .refine((phone) => phone.trim().length === 18, "auth.validation.phone"),
    email: z.string().email("auth.validation.email"),
    birth_date: z
      .string()
      .optional()
      .refine((date) => {
        if (date === undefined || date === "") return true; // Immediately return true if date is undefined, as it's optional
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >=3 && age <= 100;
      }, "auth.validation.birth_date.age"),
    telegram: z
      .string()
      .optional()
      .refine((telegram) => {
        if (telegram) {
          return telegram.length >= 6;
        }
        return true;
      }, "auth.validation.telegram"),
    password: z
      .string()
      .min(8, { message: "auth.validation.password.min" })
      .refine(
        (password) => /[A-Za-z]/.test(password) && /\d/.test(password),
        "auth.validation.password.refine"
      ),
    confirmPassword: z.string(),
    role_id: z.string(),
    position: z.string().nonempty(),
    preparation: z.string().nonempty(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "auth.validation.confirmPassword",
    path: ["confirmPassword"],
  });

export const EditServiceProfileValidation = z
  .object({
    first_name: z
      .string()
      .min(2, { message: "auth.validation.first_name.min" })
      .regex(/^[A-Za-zА-Яа-я- ]+$/, "auth.validation.first_name.regex"),
    last_name: z
      .string()
      .min(2, { message: "auth.validation.last_name.min" })
      .regex(/^[A-Za-zА-Яа-я- ]+$/, "auth.validation.last_name.regex"),
    middle_name: z
      .string()
      .min(2, { message: "auth.validation.middle_name.min" })
      .regex(/^[A-Za-zА-Яа-я- ]+$/, "auth.validation.middle_name.regex"),
    gender: z.string().optional(),
    phone: z
      .string()
      .optional()
      .refine(
        (phone) =>
          phone === undefined ||
          /^\+\d \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone),
        "auth.validation.phone"
      ),
    // .refine((phone) => phone.trim().length === 18, "auth.validation.phone"),
    email: z.string().email("auth.validation.email"),
    birth_date: z
      .string()
      .optional()
      .refine((date) => {
        if (date === undefined || date === "") return true; // Immediately return true if date is undefined, as it's optional
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >=3 && age <= 100;
      }, "auth.validation.birth_date.age"),
    telegram: z
      .string()
      .optional()
      .refine((telegram) => {
        if (telegram) {
          return telegram.length >= 6;
        }
        return true;
      }, "auth.validation.telegram"),
    changePassword: z.boolean(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    role_id: z.string(),
    position: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.changePassword) {
        return (
          data.password &&
          data.password.length >= 8 &&
          /[A-Za-z]/.test(data.password) &&
          /\d/.test(data.password) &&
          data.password === data.confirmPassword
        );
      }
      return true;
    },
    {
      message: "auth.validation.password",
      path: ["password"],
    }
  );

export const CreateCompetitionValidation = z
  .object({
    age: z
      .number({
        message: "competitions.createCompetition.validation.age.number",
      })
      .int()
      .min(14, "competitions.createCompetition.validation.age.min"),
    closes_at: z.string(),
    name: z
      .string()
      .min(4, "competitions.createCompetition.validation.name.min")
      .max(64, "competitions.createCompetition.validation.name.max"),
    description: z
      .string()
      .min(4, "competitions.createCompetition.validation.description.min")
      .max(256, "competitions.createCompetition.validation.description.max")
      .or(z.literal("")),
    tours: z
      .number({
        message: "competitions.createCompetition.validation.tours.number",
      })
      .int()
      .positive("competitions.createCompetition.validation.tours.positive"),
    size: z.enum(["4", "6"]).transform((val) => parseInt(val, 10)),
    matches: z
      .number({
        message: "competitions.createCompetition.validation.matches.number",
      })
      .int()
      .positive("competitions.createCompetition.validation.matches.positive"),
    days: z.array(
      z
        .object({
          date: z.string().refine((date) => {
            const today = new Date();
            const tournamentDate = new Date(date);
            return tournamentDate > today;
          }, "competitions.createCompetition.validation.days.date"),
          start_time: z.string().min(1),
          end_time: z.string().min(1),
        })
        .refine((data) => data.start_time < data.end_time, {
          message: "competitions.createCompetition.validation.days.end_time",
          path: ["end_time"],
        })
    ),
  })
  .refine(
    (data) => {
      const closes_at = new Date(data.closes_at);
      const today = new Date();
      return closes_at > today;
    },
    {
      message: "competitions.createCompetition.validation.closes_at.afterToday",
      path: ["closes_at"],
    }
  );
// .refine(
//   (data) => {
//     const closes_at = new Date(data.closes_at);
//     const tournamentDate = new Date(data.date);
//     return closes_at < tournamentDate;
//   },
//   {
//     message:
//       "competitions.createCompetition.validation.closes_at.beforeCompetition",
//     path: ["closes_at"],
//   }
// )

export const EditCompetitionValidation = z.object({
  closes_at: z.string(),
  name: z
    .string()
    .min(4, "competitions.createCompetition.validation.name.min")
    .max(64, "competitions.createCompetition.validation.name.max"),
  description: z
    .string()
    .min(4, "competitions.createCompetition.validation.description.min")
    .max(256, "competitions.createCompetition.validation.description.max")
    .or(z.literal("")),
});

export const ProfileDocumentsValidation = z.object({
  name: z
    .string()
    .min(4, "profile.documents.validation.name.min")
    .max(64, "profile.documents.validation.name.max"),
});
