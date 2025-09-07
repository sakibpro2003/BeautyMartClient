// loginValidation.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(4, "Password must be at least 6 characters long")
    .nonempty("Password is required"),
});
