"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, Key, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";
import { changePasswordAction } from "@/app/actions/settings";
import { useState } from "react";
import { deleteAccountAction } from "@/app/actions/auth";

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
  const [serverMessage, setServerMessage] = useState<{ type: "success" | "error" | null; text: string }>({ type: null, text: "" });
  // New states for the Danger Zone
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(PasswordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    setServerMessage({ type: null, text: "" });

    const result = await changePasswordAction({
      old_password: data.oldPassword,
      new_password: data.newPassword,
    });

    if (result.success) {
      setServerMessage({ type: "success", text: "Password updated successfully! Your account is secure." });
      reset(); 
    } else {
      setServerMessage({ type: "error", text: result.error || "Failed to update password." });
    }
  };
  // New handler for account deletion
  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteAccountAction();
  };

  return (
    <div className="max-w-2xl space-y-8">
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
          
          {serverMessage.type === "success" && (
            <div className="flex items-center gap-3 p-4 text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle size={18} className="text-green-600" />
              <p>{serverMessage.text}</p>
            </div>
          )}

          {serverMessage.type === "error" && (
            <div className="flex items-center gap-3 p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={18} className="text-red-600" />
              <p>{serverMessage.text}</p>
            </div>
          )}
        
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
      {/* DANGER ZONE SECTION ADDED BELOW */}
      <section className="bg-white border border-red-200 rounded-xl p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
          <p className="text-sm text-slate-600 max-w-md">
            Once you delete your account, there is no going back. All of your SEO history, metrics, and connected integrations will be permanently wiped.
          </p>
        </div>
        
        {!showConfirm ? (
          <button 
            onClick={() => setShowConfirm(true)}
            className="px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-lg transition-colors border border-red-200 text-sm"
          >
            Delete Account
          </button>
        ) : (
          <div className="p-5 bg-red-50 border border-red-200 rounded-xl max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle size={20} />
              <span className="font-bold">Are you absolutely sure?</span>
            </div>
            <p className="text-sm text-red-700/90 mb-5 leading-relaxed">
              This action cannot be undone. You will lose access to STRIVE immediately.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete My Account"
                )}
              </button>
              <button 
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 border border-slate-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}