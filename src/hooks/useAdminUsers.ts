import { useState } from "react";
import { deleteUserAction, toggleUserAction } from "@/app/actions/admin";
import { user } from "@/app/types/auth";

export function useAdminUsers(initialUsers: user[]) {
  const [users, setUsers] = useState<user[]>(initialUsers);
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  async function handleToggle(userId: number) {
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;
    
    setLoadingId(userId);
    const newStatus = !targetUser.is_active;
    const original = [...users];
    
    // Optimistic update
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, is_active: newStatus } : u))
    );

    const result = await toggleUserAction(userId, newStatus);
    if (!result.success) {
      setUsers(original); // revert if server fails
      setError(result.error || "Failed to toggle user");
    }
    setLoadingId(null);
  }

  async function handleDelete(userId: number) {
    setLoadingId(userId);
    const result = await deleteUserAction(userId);
    if (result.success) {
      setUsers(users.filter((u) => u.id !== userId));
    } else {
      setError(result.error || "Failed to delete user");
    }
    setLoadingId(null);
  }

  const handleUserUpdated = (updatedUser: user) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  const handleUserCreated = (newUser: user) => {
    setUsers([newUser, ...users]);
  };

  return {
    users,
    error,
    setError,
    loadingId,
    handleToggle,
    handleDelete,
    handleUserUpdated,
    handleUserCreated
  };
}
