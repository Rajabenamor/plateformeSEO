"use client";

import { createUserAction } from "@/app/actions/auth"; 
import { AdminSchema, AdminSchemaData } from "@/app/types/auth"; // <-- Make sure to import your schema
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface Props {
  onClose: () => void;
  onCreated: (user: any) => void;
  isSuperAdmin: boolean; 
}

export default function CreateUserModal({ onClose, onCreated, isSuperAdmin }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const {
    register,
    handleSubmit,
    watch, // <-- Added watch
    formState: { errors, isSubmitting },
  } = useForm<AdminSchemaData>({
    resolver: zodResolver(AdminSchema), // <-- Uncommented and active!
    defaultValues: {
      username: "",
      password: "",
      email: "",
      role: "user", 
    },
  });

  const selectedRole = watch("role"); // Watch the role to update the UI

  const onSubmit = async (data: AdminSchemaData) => {
    setError(null);

    // AUTOMATIC LOGIC: Inject the correct status before sending
    const finalData = {
      ...data,
      status: data.role === "user" ? "inactive" : "active",
    };

    const result = await createUserAction(finalData);
    
    if (result.success) {
      toast.success("User created successfully");
      onCreated(result.user);
      onClose();
    } else {
      setError(result.error || "An unexpected error occurred");
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-xl p-6 shadow-lg max-w-sm w-full mx-4 relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="mb-5">
          <h2 className="text-lg font-bold text-primary mb-1">
            Create New User
          </h2>
          <p className="text-sm text-foreground/60 mb-4">
            Add a new user and assign their system role.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Username</label>
            <input
              {...register("username")}
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15418c] text-sm"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {String(errors.username.message)}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Email {selectedRole === "user" && <span className="text-red-500">*</span>}
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15418c] text-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {String(errors.email.message)}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15418c] text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {String(errors.password.message)}
              </p>
            )}
          </div>

          <div className="pt-2">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Select Role
            </label>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="user"
                  {...register("role")}
                  className="w-4 h-4 text-[#15418c] bg-gray-100 border-gray-300 focus:ring-[#15418c]"
                />
                <span className="text-sm text-gray-700">User</span>
              </label>
              
              {isSuperAdmin && (
                <>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="admin"
                      {...register("role")}
                      className="w-4 h-4 text-[#15418c] bg-gray-100 border-gray-300 focus:ring-[#15418c]"
                    />
                    <span className="text-sm text-gray-700">Admin</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="super_admin"
                      {...register("role")}
                      className="w-4 h-4 text-[#15418c] bg-gray-100 border-gray-300 focus:ring-[#15418c]"
                    />
                    <span className="text-sm text-gray-700">Super Admin</span>
                  </label>
                </>
              )}
            </div>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">
                {String(errors.role.message)}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg bg-white hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-[#15418c] rounded-lg disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}