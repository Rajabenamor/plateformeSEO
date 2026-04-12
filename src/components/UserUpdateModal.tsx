"use client";

import { updateUserAction } from "@/app/actions/auth";
import { user } from "@/app/types/auth";
import { useState } from "react";



interface UpdateUserModalProps {
    user : user;
    onClose : ()=> void;
    onUpdated: (updatedUser : user) => void;
}

export default function UpdateUserModal ({user,onClose,onUpdated}:UpdateUserModalProps){
  // Initialize state with the existing user's data
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [isStaff, setIsStaff] = useState(user.is_staff);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Call your Next.js Server Action to hit the Django backend
    const result = await updateUserAction(user.id, {
      username,
      email,
      is_staff: isStaff,
    });

    if (result.success && result.data) {
      onUpdated(result.data); // Instantly update the table UI
    } else {
      setError(result.error || "Failed to update user.");
    }
    
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      {/* Note: Added bg-white incase your global bg-card isn't fully opaque */}
      <div className="bg-card bg-white rounded-xl p-6 shadow-lg max-w-sm w-full mx-4">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Update User
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-border rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#15418c] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#15418c] outline-none"
            />
          </div>

          {/* <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="is_staff"
              checked={isStaff}
              onChange={(e) => setIsStaff(e.target.checked)}
              className="h-4 w-4 text-[#15418c] rounded border-gray-300 focus:ring-[#15418c] cursor-pointer"
            />
            <label htmlFor="is_staff" className="text-sm font-medium text-foreground cursor-pointer">
              Admin Privileges
            </label>
          </div> */}

          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-[#15418c] rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}