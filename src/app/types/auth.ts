import * as z from "zod";

export const registerSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 charachters"),
    confirmPassword: z.string(),
  }) .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], 
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object ({
    email : z.string().email("Please enter a valid email address"),
});

export type forgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
 password: z.string().min(8, "Password must be at least 8 charachters"),
    confirmPassword: z.string(),
  }) .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], 
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export type user = {
  id: number;
  username: string;
  email:string;
  is_active:boolean;
  is_staff: boolean;
  date_joined:string;
}

export type Props ={
  onClose: ()=> void;
  onCreated: (user:any)=>void;
}

export const AdminSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin", "super_admin"]),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]).optional(),
  joinedDate: z.string().optional(), 
}).superRefine((data, ctx) => {
  if (data.role === "user" && (!data.email || data.email.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Email is required for standard users",
      path: ["email"],
    });
  }
});

export type AdminSchemaData = z.infer<typeof AdminSchema>;

export interface AuthUser{
  id:number;
  isSuperAdmin:boolean;
}