"use server";
//The Action Taker: This handles database mutations (logging in, registering, changing passwords, destroying cookies).
import { cookies } from "next/headers";
import { AdminSchema, AdminSchemaData, forgotPasswordFormData, LoginFormData, RegisterFormData, ResetPasswordFormData } from "@/app/types/auth";
import { ActionResult } from "next/dist/shared/lib/app-router-types";
import { redirect } from "next/navigation";
import { verifyAdminSession, verifySession } from "@/lib/session";
import { success } from "zod";
import { getAuthUser } from "@/lib/auth-utils";
import isURL from "validator/lib/isURL";

export async function registerServerAction(data : RegisterFormData){
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register/`,{
            method:"POST",
            headers:{
              "Content-Type":"application/json",
            },
            body: JSON.stringify({
              username:data.username,
              email: data.email,
              password:data.password,
            }),
        });
        if(!response.ok){
            const errorData = await response.json()
            return {success : false , error:Object.values(errorData)[0]}; 
        }
        return{success: true};

    }catch(error){
        return {success : false , error: "Failed to connect to the server."};
    }
}

export async function loginServerAction(data:LoginFormData){
    let redirectPath="/";
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login/`,{
            method:"POST",
            headers:{
              "Content-Type":"application/json",
            },
            body: JSON.stringify({
              username:data.username,
              password:data.password,
            }),
        });
        const result = await response.json();
        
        if(!response.ok){
            if (result.error && Array.isArray(result.error)) {
                return { success: false, error: result.error[0] }; 
            }
            if (result.detail) {
                return {success : false , error: result.detail || "Invalid credentials"}; 
            }
            return { success: true, data: result};
        }

        const cookieStore = await cookies();
        
        cookieStore.set("access_token",result.access, {
            httpOnly: true,
            secure:process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 15 , 
            path : "/",
        });
        
        cookieStore.set("refresh_token",result.refresh, {
            httpOnly: true,
            secure:process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24*7 , 
            path : "/",
        });
        
        if (result.user) {
            cookieStore.set("user_data", JSON.stringify(result.user), {
                httpOnly: false, 
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7, 
            });
        }
        
        const isAdmin = await verifyAdminSession();
        redirectPath= isAdmin ? "/admin" : "/" ;

    }catch(error){
        return {success : false , error: "Connection Failed"};
    }
    
    redirect(redirectPath);
};

//logout action 
export async function logoutAction(){
    const cookieStore = await cookies();
    
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    cookieStore.delete("user_data"); 
    
    redirect('/');
}

//forgotPassword
export async function forgotPasswordAction(data: forgotPasswordFormData): Promise<ActionResult>{
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/password_reset/`,{
            method:"POST",
            headers:{
              "Content-Type":"application/json",
            },
            body: JSON.stringify({email: data.email }),
        }); 
        if(!response.ok){
            console.error("Password reset failed:", await response.json())
        }
        return {success:true};
    }catch(e){
        return{success: false,error:"Server connection failed"};
    }
}

//reset password
export async function resetPasswordAction(data: ResetPasswordFormData, token :string): Promise<ActionResult>{
   try {
        console.log("Token being sent:", token)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/password_reset/confirm/`,{
            method:"POST",
            headers:{
              "Content-Type":"application/json",
            },
            body: JSON.stringify({
                token: token.trim(),
                password: data.password }),
        }); 
        
        if(!response.ok){
            const errorData = await response.json();
            return {success:false , error : errorData.password?.[0] || "Invalid or expired token."};
        }
        return {success:true};
    }catch(e){
        console.error("The actual error is:", e);
        return{success: false,error:"Server connection failed."};
    }
}

//checks token validity
export async function validateResetTokenAction(token :string): Promise<ActionResult>{
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/password_reset/validate_token/`,{
            method:"POST",
            headers:{
              "Content-Type":"application/json",
            },
            body: JSON.stringify({token}),
        }); 
        return response.ok;
    }catch(error){
        return false;
    }
}

export type ActionState = {
    error: string | null;
};

//FUNCTION1 : handles the form submission from the home page
export async function analyzeUrlAction(prevState: ActionState,formData: FormData): Promise<ActionState> {
     const isLoggedIn = await verifySession(); 

     if (!isLoggedIn) {
       redirect('/auth/login?error=please_login');
     }

    let url = formData.get('url') as string;
    if (!url) return { error: null };
    
    url = url.trim();
    if (!isURL(url, { require_tld: true, require_protocol: false })) {
        return { error: "Please enter a valid website URL with a dot (e.g., example.com)" };
    }
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    
    redirect(`/dashboard?url=${encodeURIComponent(formattedUrl)}`);
}

//FUNCTION 2 : handles the form submission from the home page
export async function fetchDashboardDataSecurely(url: string) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard/?url=${encodeURIComponent(url)}`, {
        method: "GET",
        headers: headers,
    });

    if (!response.ok) {
        throw new Error("Analysis failed");
    }

    return await response.json();
}

//google sign in
export async function GoogleLoginAction(Credential: string){
    let redirectPath = "/";
    
    try{
        const response= await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google/`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({credential: Credential}), 
        });
        
        const result= await response.json();
        
        if(!response.ok){
            return {success:false, error:result.error || "Google login failed"};
        }
        
        const cookieStore = await cookies();
        
        cookieStore.set("access_token",result.access, {
            httpOnly: true,
            secure:process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 15 , 
            path : "/",
        });
        
        cookieStore.set("refresh_token",result.refresh, {
            httpOnly: true,
            secure:process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24*7 , 
            path : "/",
        });

        if (result.user) {
            cookieStore.set("user_data", JSON.stringify(result.user), {
                httpOnly: false, 
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7, 
            });
        }

        const isAdmin = await verifyAdminSession();
        redirectPath = isAdmin ? "/admin" : "/";

    }catch (error){
        return{ success: false, error: "Connection failed"};
    }
    
    // Server-side redirect triggers full re-render
    redirect(redirectPath);
}

//******************ADMIN PART******************/

// get all users
export async function getUsersAction() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            cache: "no-store",
        });

        if (!response.ok) return { success: false, error: "Failed to fetch users" };
        const data = await response.json();
        const users = data.results ?? data;  
        const count = data.count ?? users.length;
        
        return { success: true,  users, count };
    } catch (error) {
        return { success: false, error: "Server connection failed" };
    }
}

// activate/deactivate user
export async function toggleUserAction(userId: number, newStatus:boolean) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;
      
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/${userId}/toggle/`, {  
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body:JSON.stringify({
                is_active: newStatus
            })
        });

        if (!response.ok) return { success: false, error: "Failed to toggle user" };
        const result = await response.json();
        return { success: true, user: result };
    } catch (error) {
        return { success: false, error: "Server connection failed" };
    }
}

// delete user
export async function deleteUserAction(userId: number) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/${userId}/delete/`, {  
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
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

//update user
export async function updateUserAction(userId:number,data:{username:string;email:string; is_staff:boolean}){
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        throw new Error("Not authenticated");
    }
    
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/${userId}/update/`,{
            method:"PATCH",
            headers: {
                "Content-Type":"application/json",
                "Authorization":`Bearer ${accessToken}`
            },
            body:JSON.stringify(data),
        });
        if(!response.ok){
            const errorData = await response.json();
            return{success:false,error:errorData.detail || "Failed to update user."};
        }
        const updatedUser = await response.json();
        return {success:true , data:updatedUser};
    }catch(error){
        return{success:false, error:"Server Connection failed."};
    }
}

// redirect path based on role
export async function getRedirectPathAction() {
    const isAdmin = await verifyAdminSession();
    return isAdmin ? "/admin" : "/";
}

// create users / admins / super admins
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
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value;
        
        if (!accessToken) {
            return { success: false, error: "Authentication required" };
        }

        const validData = validation.data;

        const djangoPayload = {
            username: validData.username,
            password: validData.password,
            email: validData.email,
            is_staff: validData.role === "admin" || validData.role === "super_admin", 
            is_superuser: validData.role === "super_admin",
            // is_active: validData.status === "active",
            // Calculate active status securely on the server
            is_active: validData.role !== "user",
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/create/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
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
export async function getIntegrationStatusAction() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    
    if (!token) return { success: false, error: "Not authenticated" };

    try {
        // Notice the exact URL matching your Django trace (no /api/ prefix)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/integrations/status/`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!res.ok) return { success: false };
        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        return { success: false };
    }
}

export async function exchangeGithubTokenAction(code: string, installation_id: string | null) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    
    if (!token) return { success: false, error: "Not authenticated" };

    try {
        // Notice the exact URL matching your Django trace
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/integrations/github/exchange/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ code, installation_id })
        });

        if (!res.ok) {
            const err = await res.json();
            return { success: false, error: err.error || "Failed to exchange token" };
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}

export async function createGithubPullRequestAction(fixTitle: string, fixExplanation: string, targetFile: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    
    if (!token) return { success: false, error: "Not authenticated" };

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/integrations/github/create-pr/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ 
                title: fixTitle, 
                explanation: fixExplanation, 
                target_file: targetFile 
            })
        });

        const data = await res.json();
        
        if (!res.ok) {
            return { success: false, error: data.error || "Failed to create PR" };
        }
        
        return { success: true, prUrl: data.pr_url };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}

export async function saveGithubRepoAction(repoName: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    
    if (!token) return { success: false, error: "Not authenticated" };

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/integrations/github/save-repo/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ repo_name: repoName })
        });

        if (!res.ok) {
            return { success: false, error: "Failed to save repository" };
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}
