import { z } from "zod";
export const userFormSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().optional(),
  role: z.enum(["admin", "user", "manager"]),
  designation: z.string().min(1, "Designation is required"),
});

export type UserFormData = z.infer<typeof userFormSchema>;
