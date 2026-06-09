"use server";

import { 
    AdminSchema, 
    AdminSchemaData 
} from "@/app/types/auth";
import { verifyAdminSession } from "@/lib/session";
import { getAuthUser } from "@/lib/auth-utils";
import { secureFetch } from "@/lib/api";
export async function getUsersAction() {
    try {
        const response = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/`, {
            method: "GET",
            cache: "no-store",
        });

        if (!response.ok) return { success: false, error: "Failed to fetch users" };
        const data = await response.json();
        const users = data.results ?? data;
        const count = data.count ?? users.length;

        return { success: true, users, count };
    } catch (error) {
        return { success: false, error: "Server connection failed" };
    }
}

export async function toggleUserAction(userId: number, newStatus: boolean) {
    try {
        const response = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/${userId}/toggle/`, {
            method: "PATCH",
            body: JSON.stringify({ is_active: newStatus })
        });

        if (!response.ok) return { success: false, error: "Failed to toggle user" };
        const result = await response.json();
        return { success: true, user: result };
    } catch (error) {
        return { success: false, error: "Server connection failed" };
    }
}

export async function deleteUserAction(userId: number) {
    try {
        const response = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/${userId}/delete/`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const error = await response.json();
            return { success: false, error: error.detail || "Failed to delete user" };
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: "Server connection failed" };
    }
}

export async function updateUserAction(userId: number, data: { username: string; email: string; is_staff: boolean }) {
    try {
        const response = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/${userId}/update/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.detail || "Failed to update user." };
        }
        const updatedUser = await response.json();
        return { success: true, data: updatedUser };
    } catch (error) {
        return { success: false, error: "Server Connection failed." };
    }
}

export async function getRedirectPathAction() {
    const isAdmin = await verifyAdminSession();
    return isAdmin ? "/admin" : "/";
}

export async function createUserAction(data: AdminSchemaData) {
    const user = await getAuthUser();

    if (!user) {
        return { success: false, error: "Unauthorized: You must be logged in." };
    }

    if (data.role === "admin" || data.role === "super_admin") {
        if (!user.isSuperAdmin) {
            return { success: false, error: "Unauthorized: Only Super Admins can create other administrators." };
        }
    }

    const validation = AdminSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: "Invalid input data" };
    }

    try {
        const validData = validation.data;
        const djangoPayload = {
            username: validData.username,
            password: validData.password,
            email: validData.email,
            is_staff: validData.role === "admin" || validData.role === "super_admin",
            is_superuser: validData.role === "super_admin",
            is_active: validData.role !== "user",
        };

        const response = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/create/`, {
            method: "POST",
            body: JSON.stringify(djangoPayload),
        });

        if (!response.ok) {
            const error = await response.json();
            return { success: false, error: error.error || error.detail || "Failed to create user" };
        }

        const result = await response.json();
        return { success: true, user: result };
    } catch (error) {
        console.error("Create User Error:", error);
        return { success: false, error: "Server connection failed" };
    }
}
export async function getAdminKPIsAction() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
        
        // Use secureFetch directly instead of "api.get"
        const response = await secureFetch(`${baseUrl}/api/admin/kpis/`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data };

    } catch (error: any) {
        console.error("Error fetching KPIs:", error);
        return { success: false, error: "Failed to load KPIs" };
    }
}