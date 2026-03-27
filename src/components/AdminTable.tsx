"use client";

import { deleteUserAction, toggleUserAction } from "@/app/actions/auth";
import { user } from "@/app/types/auth";
import { useState } from "react";
import CreateAdminModal from "./createAdminModal";

export default function AdminTable({
  initialUsers,
  isSuperAdmin,
  currentUserId
}: {
  initialUsers: user[];
  isSuperAdmin: boolean;
  currentUserId : number |string | undefined
}) {
  const [users, setUsers] = useState<user[]>(initialUsers);
  const [confirmDelete, setConfirmDelete] = useState<user | null>(null);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState<number | null>(null);

  async function handleToggle(userId: number) {
    const targetUser = users.find((u)=> u.id === userId);
    if(!targetUser)return;
    const newStatus = !targetUser.is_active;
    const original = [...users];
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, is_active: newStatus } : u
      )
    );

    const result = await toggleUserAction(userId,newStatus);
    if (!result.success) {
      // revert if server fails
      setUsers(original);
      setError(result.error || "Failed to toggle user");
    }
    setLoadingId(null);
  }
  async function handleDelete(userId: number) {
    setLoadingId(userId);
    const result = await deleteUserAction(userId);
    if (result.success) {
      setUsers(users.filter((u) => u.id !== userId));
      setConfirmDelete(null);
    } else {
      setError(result.error || "Failed to delete user");
      setConfirmDelete(null);
    }
    setLoadingId(null);
  }

  return (
    <div>
      {/* error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Create admin button  */}
      {isSuperAdmin && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowCreateAdmin(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Create admin
          </button>
        </div>
      )}
      {/* Create admin modal */}
      {showCreateAdmin && (
        <CreateAdminModal
          onClose={() => setShowCreateAdmin(false)}
          onCreated={(newUser) => setUsers([newUser, ...users])} //adds new admin to list instantly
        />
      )}
      {/* delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Delete user?
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-900">
                {confirmDelete.username}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* users table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => {
              //super admin can modify anyone except himself
              //sub admin can only modify regular users
              const isSelf = String(user.id) === String(currentUserId);
              const canModify = !isSelf && (isSuperAdmin || !user.is_staff);
              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.is_staff
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.is_staff ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.date_joined).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {canModify? (
                        <>
                          <button
                          disabled={loadingId === user.id}
                            onClick={() => handleToggle(user.id)}
                            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                              user.is_active
                                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                          >
                            {user.is_active ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            disabled={loadingId === user.id}
                            onClick={() => setConfirmDelete(user)}
                            className="px-3 py-1 text-xs font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      ):(
                      
                      
                        <span className="text-xs text-gray-400 italic">
                         {isSelf? "You (protected)" : "Protected"} 
                        </span>
                      
                    )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
