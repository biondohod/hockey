import { ZodType, z } from "zod";

// ZodType<INewUser>
export const SignUpValidation: ZodType<INewUser> = z.object({
  first_name: z.string().min(8, { message: "Name must be at least 8 characters long" }),
  last_name: z.string().nonempty(),
  middle_name: z.string().nonempty(),
  // is_male: z.boolean(),
  phone: z.string().nonempty(),
  email: z.string().email(),
  birth_date: z.string().nonempty(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});