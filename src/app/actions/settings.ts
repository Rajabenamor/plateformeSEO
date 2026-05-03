"use server"
import { AnalysisRecord } from "../types/analysis";
import { secureFetch } from "@/lib/api";

// Define the expected input types based on your Django Serializer
interface ChangePasswordData {
    old_password: string;
    new_password: string;
} 

  export async function changePasswordAction(data: ChangePasswordData) {
    try {
      const response = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/users/change-password/`, {
        method: "PUT", // Matches the generics.UpdateAPIView in Django
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
      const response = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/users/update-profile/`, {
        method: "POST",
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        // Handle Django REST Framework dictionary errors nicely
        const errorMessage = errorData.error || errorData.username?.[0] || errorData.email?.[0] || "Failed to update profile.";
        return { success: false, error: errorMessage };
      }
  
      const responseData = await response.json();
    
    //  pass along the email_pending and message flags from Django
    return { 
      success: true, 
      user: responseData, // Or responseData.user depending on your exact Django response format
      email_pending: responseData.email_pending || false, 
      message: responseData.message || "Profile updated successfully"
    };
    } catch (error) {
      return { success: false, error: "Server connection failed." };
    }
  }
  //verify email
  type VerifyEmailResponse = {
    success: boolean;
    error?: string;
    new_email?: string;
  };

  export async function verifyEmailAction(token: string): Promise<VerifyEmailResponse> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/users/verify-email/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
  
      const data = await response.json();
      console.log("DJANGO VERIFY RESPONSE:", data);
      if (response.ok && data.success) {
        return { success: true ,new_email: data.new_email};
      } else {
        return { success: false, error: data.error || "Verification failed. The link may have expired." };
      }
    } catch (error) {
      return { success: false, error: "A network error occurred." };
    }
  }

  // Define the interface here or import it

  
  export async function getHistoryAction() {
    try {
      const response = await secureFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/analysis/history/`, {
        method: "GET",
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
