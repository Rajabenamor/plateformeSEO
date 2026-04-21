// @/app/dashboard/settings/security/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Shield, Key } from "lucide-react";
import { changePasswordAction } from "@/app/actions/settings"; // You'll create this server action

const PasswordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof PasswordSchema>;

export default function SecuritySettingsPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(PasswordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    const result = await changePasswordAction({
      old_password: data.oldPassword,
      new_password: data.newPassword,
    });

    if (result.success) {
      toast.success("Password updated successfully");
      reset(); // Clear the form fields
    } else {
      toast.error(result.error || "Failed to update password");
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Security Settings</h2>
        <p className="text-sm text-slate-500">Update your password to keep your account secure.</p>
      </div>

      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="p-2 bg-[#15418c]/10 rounded-lg">
            <Shield size={20} className="text-[#15418c]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-800">Change Password</h3>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
              <Key size={14} className="text-slate-400" />
              Current Password
            </label>
            <input
              {...register("oldPassword")}
              type="password"
              className="w-full px-4 py-2 text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#15418c] outline-none text-sm"
            />
            {errors.oldPassword && <p className="text-red-500 text-xs mt-1">{errors.oldPassword.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">New Password</label>
            <input
              {...register("newPassword")}
              type="password"
              className="w-full px-4 py-2 text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#15418c] outline-none text-sm"
            />
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Confirm New Password</label>
            <input
              {...register("confirmPassword")}
              type="password"
              className="w-full px-4 py-2 text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#15418c] outline-none text-sm"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-[#15418c] rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}