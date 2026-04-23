"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { User as UserIcon, Mail } from "lucide-react";
import { updateProfileAction } from "@/app/actions/settings";
import type { user } from "@/app/types/auth";

// Zod Schema for Profile Validation
const ProfileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
});

type ProfileFormData = z.infer<typeof ProfileSchema>;

export default function ProfileSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
  });

  // Load initial data from the cookie
  useEffect(() => {
    const storedUser = Cookies.get("user_data");
    if (storedUser) {
      try {
        const parsedUser: user = JSON.parse(storedUser);
        setValue("username", parsedUser.username);
        setValue("email", parsedUser.email);
      } catch (error) {
        console.error("Failed to parse user data", error);
      }
    }
    setIsLoading(false);
  }, [setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    const result = await updateProfileAction(data);

    if (result.success) {
      toast.success("Profile updated successfully");
      
      // Update the local cookie so the Sidebar updates instantly!
      const storedUser = Cookies.get("user_data");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const updatedUser = { ...parsedUser, username: data.username, email: data.email };
        Cookies.set("user_data", JSON.stringify(updatedUser));
        
        // Dispatch a custom event so the Sidebar knows to re-render (Optional but great for UX)
        window.dispatchEvent(new Event("userUpdated")); 
      }
    } else {
      toast.error(result.error || "Failed to update profile");
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-slate-100 rounded-xl"></div>;
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Profile Details</h2>
        <p className="text-sm text-slate-500">Manage your personal information and email address.</p>
      </div>

      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <UserIcon size={16} className="text-slate-400" />
              <label className="text-sm font-medium text-slate-700">Username</label>
            </div>
            <input
              {...register("username")}
              type="text"
              className="w-full px-4 py-2 text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#15418c] outline-none text-sm"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Mail size={16} className="text-slate-400" />
              <label className="text-sm font-medium text-slate-700">Email Address</label>
            </div>
            <input
              {...register("email")}
              type="email"
              className="w-full px-4 py-2 text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#15418c] outline-none text-sm"
            />
            <p className="text-xs text-slate-500 mt-2">
              Note: Changing your email address may require you to verify the new address.
            </p>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-[#15418c] rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}