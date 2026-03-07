import * as z from "zod";
//register Schema
//zod schema : the strict rules for the form
export const registerSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 charachters"),
    confirmPassword: z.string(),
  }) .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // puts the error under the confirm password field
  });
//register type
//linking your Zod validation directly to TypeScript => Automatically creates a TypeScript type based on the Zod schema rules
export type RegisterFormData = z.infer<typeof registerSchema>;

//login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
//login type
export type LoginFormData = z.infer<typeof loginSchema>;