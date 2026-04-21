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

//for the "forgot password" initial request
export const forgotPasswordSchema = z.object ({
    email : z.string().email("Please enter a valid email address"),
});

export type forgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

//for the actual reset page (where the user types the new password)
export const resetPasswordSchema = z.object({

 password: z.string().min(8, "Password must be at least 8 charachters"),
    confirmPassword: z.string(),
  }) .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // puts the error under the confirm password field
  });

  export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

  //admin

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

//for admin-super_admin-user creation
export const AdminSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin", "super_admin"]),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  
  // Both made optional! The user will never type these.
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

export interface AnalysisRecord {
    id: number;
    url_analyzed: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    seo_score: number | null;
    created_at: string;
  }