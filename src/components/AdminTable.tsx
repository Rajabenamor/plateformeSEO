"use client";

import { user } from "@/app/types/auth";
import { useState } from "react";
import UpdateUserModal from "./UserUpdateModal";
import CreateUserModal from "./createUserModal";
import { useAdminUsers } from "@/hooks/useAdminUsers";

export default function AdminTable({
  initialUsers,
  isSuperAdmin,
  currentUserId,
}: {
  initialUsers: user[];
  isSuperAdmin: boolean;
  currentUserId: number | string | undefined;
}) {
  const {
    users,
    error,
    setError,
    loadingId,
    handleToggle,
    handleDelete,
    handleUserUpdated,
    handleUserCreated
  } = useAdminUsers(initialUsers);

  const [confirmDelete, setConfirmDelete] = useState<user | null>(null);
  const [userToUpdate, setUserToUpdate] = useState<user | null>(null);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);

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
            className="px-4 py-2 text-sm font-medium text-white bg-[#15418c] rounded-lg hover:bg- transition-colors"
          >
            + Create admin
          </button>
        </div>
      )}
      {/* Create admin modal */}
      {showCreateAdmin && (
        <CreateUserModal
          isSuperAdmin={isSuperAdmin}
          onClose={() => setShowCreateAdmin(false)}
          onCreated={handleUserCreated}
        />
      )}
      {/* update user modal */}
      {userToUpdate && (
        <UpdateUserModal
          user={userToUpdate}
          onClose={() => setUserToUpdate(null)}
          onUpdated={(updatedUser) => {
            handleUserUpdated(updatedUser);
            setUserToUpdate(null);
          }}
        />
      )}

      {/* delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-6 shadow-lg max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold text-primary mb-2">
              Delete user ?
            </h2>
            <p className="text-sm text-foreground/80 ">
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {confirmDelete.username}
              </span>{" "}
              ?
            </p>
            <p className="text-sm text-foreground/80 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDelete(confirmDelete.id);
                  setConfirmDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-700 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* users table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => {
              const isSelf = String(user.id) === String(currentUserId);
              const canModify = !isSelf && (isSuperAdmin || !user.is_staff);
              return (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                        user.is_active
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                        user.is_staff
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {user.is_staff ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                    {new Date(user.date_joined).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {canModify ? (
                        <>
                          <button
                            disabled={loadingId === user.id}
                            onClick={() => handleToggle(user.id)}
                            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer rounded-lg transition-colors ${
                              user.is_active
                                ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                            }`}
                          >
                            {user.is_active ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            disabled={loadingId === user.id}
                            onClick={() => setUserToUpdate(user)}
                            className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-colors"
                          >
                            Update
                          </button>
                          <button
                            disabled={loadingId === user.id}
                            onClick={() => setConfirmDelete(user)}
                            className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 cursor-pointer transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider opacity-40">
                          {isSelf ? "Self" : "Protected"}
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
