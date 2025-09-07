import { z } from "zod";

export const registrationSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "First name must be between 2 to 30 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
  phone: z.string({ required_error: "Phone is required" }),
  profileImage: z.string({ required_error: "Profile image URL required" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(4, "Minimum 4 characters required")
    .max(8, "Max 8 characters"),
  confirm_password: z
    .string({
      required_error: "Confirm password is required",
    })

    .min(4, "Minimum 4 characters required")
    .max(8, "Max 8 characters"),
});
