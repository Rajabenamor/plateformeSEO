"use server"
import { cookies } from "next/headers";
import { AnalysisRecord } from "../types/auth";

// Define the expected input types based on your Django Serializer
interface ChangePasswordData {
    old_password: string;
    new_password: string;
  }
  export async function changePasswordAction(data: ChangePasswordData) {
    try {
      // 1. Retrieve the auth token from Next.js server-side cookies
      // Replace "access_token" with the actual name of your cookie storing the JWT/OAuth token
      const cookieStore = await cookies();
      const token = cookieStore.get("access_token")?.value;
  
      if (!token) {
        return { success: false, error: "Unauthorized. Please log in again." };
      }
  
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/change-password/`, {
        method: "PUT", // Matches the generics.UpdateAPIView in Django
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Or `Token ${token}` depending on your DRF setup
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      // 3. Handle Django's response
      if (!response.ok) {
        // DRF usually returns errors in an object format like: {"old_password": ["Wrong password."]}
        // This extracts the first meaningful error message to show in the toast notification
        let errorMessage = "Failed to update password.";
        
        if (result.old_password) {
          errorMessage = result.old_password[0];
        } else if (result.new_password) {
          errorMessage = result.new_password[0];
        } else if (result.detail) {
          errorMessage = result.detail;
        }
  
        return { success: false, error: errorMessage };
      }
  
      return { success: true };
  
    } catch (error) {
      console.error("Password change error:", error);
      return { success: false, error: "An unexpected network error occurred." };
    }
  }

export async function updateProfileAction(data: { username: string; email: string }) {
    try {
      const cookieStore = await cookies();
      const accessToken = cookieStore.get("access_token")?.value;
  
      if (!accessToken) return { success: false, error: "Not authenticated" };
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        // Handle Django REST Framework dictionary errors nicely
        const errorMessage = errorData.username?.[0] || errorData.email?.[0] || "Failed to update profile.";
        return { success: false, error: errorMessage };
      }
  
      const updatedUser = await response.json();
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: "Server connection failed." };
    }
  }

  // Define the interface here or import it

  
  export async function getHistoryAction() {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("access_token")?.value;
  
      if (!token) {
        return { success: false, error: "Unauthorized. Please log in again." };
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/analysis/history/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        // Optional: Add cache rules. 'no-store' ensures fresh data every time the user checks history
        cache: 'no-store' 
      });
  
      if (!response.ok) {
        return { success: false, error: "Failed to fetch history." };
      }
  
      const data: AnalysisRecord[] = await response.json();
      // 🟢 ADD THIS LINE:
    console.log("RAW DATA FROM DJANGO:", data);
      return { success: true, data };
  
    } catch (error) {
      console.error("History fetch error:", error);
      return { success: false, error: "An unexpected network error occurred." };
    }
  }