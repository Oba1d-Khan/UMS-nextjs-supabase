import { z } from "zod";

export const signupSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  designation: z.string().min(2, "Designation must be at least 2 characters"),
  email: z.email("Enter a valid email"),
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .max(14, "Phone number cannot exceed 14 digits")
    .regex(/^\d+$/, "Phone number must contain only numbers"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// types
export type SignupSchema = z.infer<typeof signupSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
