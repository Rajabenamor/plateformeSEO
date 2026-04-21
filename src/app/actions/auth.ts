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

 // tells next.js this code MUST run securely on the server , not in the browser
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
            //returns the exact error from django 
            return {success : false , error:Object.values(errorData)[0]}; 
            // success:false => the login/register failed, do not redirect them to the profile page
            // error:Object.values(errorData)[0] => takes the first item of the array leaving keys like username ect
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
        // SCENARIO 1: Django sends your custom pending/deactivated message inside an array
      if (result.error && Array.isArray(result.error)) {
        return { success: false, error: result.error[0] }; // Grabs the exact text
      }

      // SCENARIO 2: Django sends a default JWT "detail" error (Wrong password/email)
      if (result.detail) {
        //returns the exact error from django 
        return {success : false , error: result.detail || "Invalid credentials"}; 
      }
      return { success: true, data: result};
    }
//store the jwt in an HTTpOnly cookie
//this makes the token invisible to client-side JavaScript
const cookieStore = await cookies();
//store access token
cookieStore.set("access_token",result.access, {
    httpOnly: true,
    secure:process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15 , // 15 minutes - matches simple_jwt config
    path : "/",
});
//store refresh token
cookieStore.set("refresh_token",result.refresh, {
    httpOnly: true,
    secure:process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24*7 , // 7 days 
    path : "/",
});
// 3. Store User Data for the Sidebar!
// Notice `httpOnly: false`. This allows the browser to read the username for the UI!
if (result.user) {
    cookieStore.set("user_data", JSON.stringify(result.user), {
        httpOnly: false, // Must be false so our client sidebar can read it!
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
}
//return{success:true};
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
    
    //redirect user
    redirect('/');
 }

 //forgotPassword

 //tells the backend to send the email

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
            //log the error-side for debugging but never tell the user
            console.error("Password reset failed:", await response.json())
            // const errorData = await response.json();
            // return {success:false , error : errorData.detail || "Email not found"};

        }
        //always return success - never reveal if email exists or not
        return {success:true};
    }catch(e){
        return{success: false,error:"Server connection failed"};

    }

 }


 {/*reset password */}

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
     //return ok id django says ok , false if expired
     return response.ok;

    }catch(error){
        //if the backend is down or throw an error , its invalid
        return false;
    }
    }

//analyze 

// export async function analyzeUrlAction(formData : FormData){
//     //check if the user is logged in 
//     const isLoggedIn = await verifySession();

//     //if not logged in , redirect them to the login page
//     if(!isLoggedIn){
//         redirect('/auth/login?error=please_login');
//     }
//     //forward the token to django for protected routes
//     const cookieStore = await cookies();
//     const accessToken = cookieStore.get("access_token")?.value;
//     //if they are logged in 
//     let url = formData.get('url') as string;
//     if (!url) return;

//     //ensure the url has https://
//     url = url.startsWith("http") ? url : `http://${url}`;
//     //django api ..
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/analyze/`,{
//         method:"POST",
//         headers:{
//           "Content-Type":"application/json",
//           "Authorization": `Bearer ${accessToken}`, //send token to django
//         },
//         body: JSON.stringify({url}), 
//     });
//     //handle errors if django rejects it
//     if(!response.ok){
//         redirect('/?error=analysis_failed');
//     }
//     // if successful , redirect to the dashboard to show the results
//     redirect(`/dashboard?url=${encodeURIComponent(url)}`);

// }
export type ActionState = {
    error: string | null;
};
//FUNCTION1 : handles the form submission from the home page
export async function analyzeUrlAction(prevState: ActionState,formData: FormData): Promise<ActionState> {
    // 1. Check if the user is logged in
     const isLoggedIn = await verifySession(); // (Uncomment if you have this function ready)

     if (!isLoggedIn) {
       redirect('/auth/login?error=please_login');
     }

    // 2. Get the URL the user typed in
    let url = formData.get('url') as string;
    
    // If they submitted an empty form, do nothing
    if (!url) return { error: null };
    
    // 3. Ensure the URL is formatted correctly with https://
    url = url.trim();
// The Validator check: 
    // require_tld: true ensures they type ".com" or similar.
    // require_protocol: false means they can just type "github.com" without "https://"
    if (!isURL(url, { require_tld: true, require_protocol: false })) {
        return { error: "Please enter a valid website URL with a dot (e.g., example.com)" };
    
    }
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    // 4. INSTANTLY redirect to the dashboard. 
    // Do NOT fetch Django here. Let the Dashboard page do it so the loading screen shows!
    redirect(`/dashboard?url=${encodeURIComponent(formattedUrl)}`);
}
//FUNCTION 2 : handles the form submission from the home page
export async function fetchDashboardDataSecurely(url: string) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        throw new Error("Not authenticated");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard/?url=${encodeURIComponent(url)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`, 
        },
    });

    if (!response.ok) {
        throw new Error("Analysis failed");
    }

    return await response.json();
}

//google sign in

export async function GoogleLoginAction(Credential: string){
    try{
        const response= await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google/`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({credential: Credential}),   //send ID token directly
    });
    const result= await response.json();
    if(!response.ok){
        return {success:false, error:result.error || "Google login failed"};

    }
    const cookieStore = await cookies();
//store access token
cookieStore.set("access_token",result.access, {
    httpOnly: true,
    secure:process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15 , // 15 minutes - matches simple_jwt config
    path : "/",
});
//store refresh token
cookieStore.set("refresh_token",result.refresh, {
    httpOnly: true,
    secure:process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24*7 , // 7 days 
    path : "/",
});
return{success:true};


    }catch (error){
        return{ success: false, error: "Connection failed"};
    }
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
            // handle both paginated and non-paginated responses
            const users = data.results ?? data;  // ← if no results key, use data directly
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
      
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/${userId}/toggle/`, {  // ← trailing slash
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            //send the exact key django is looking for 
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

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/${userId}/delete/`, {  // ← trailing slash
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
    
    // 1. Permission Checks
    if (!user) {
        return { success: false, error: "Unauthorized: You must be logged in." };
    }

    // If trying to create any type of admin, strictly check for super admin status
    if (data.role === "admin" || data.role === "super_admin") {
        if (!user.isSuperAdmin) {
            return { success: false, error: "Unauthorized: Only Super Admins can create other administrators." };
        }
    }

    // 2. Validate input shapes
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

        // 3. Map Next.js Data to Django Data
        const djangoPayload = {
            username: validData.username,
            password: validData.password,
            email: validData.email,
            // Boolean translations:
            is_staff: validData.role === "admin" || validData.role === "super_admin", 
            is_superuser: validData.role === "super_admin",
            // is_active: validData.status === "active",
            // Calculate active status securely on the server
            is_active: validData.role !== "user",
        };

        // Note: Make sure your Django url ends in /create/ to match our generic setup
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
            // Handle both standard error formats depending on how DRF sends it
            return { success: false, error: error.error || error.detail || "Failed to create user" };
        }

        const result = await response.json();
        return { success: true, user: result };

    } catch (error) {
        console.error("Create User Error:", error);
        return { success: false, error: "Server connection failed" };
    }
}

// export async function createUserAction(data: AdminSchemaData) {
//     const user = await getAuthUser();
    
//     // 1. Permission Checks
//     if (!user) {
//         return { success: false, error: "Unauthorized: You must be logged in." };
//     }

//     if (data.role === "admin" || data.role === "super_admin") {
//         if (!user.isSuperAdmin) {
//             return { success: false, error: "Unauthorized: Only Super Admins can create other administrators." };
//         }
//     }

//     // 2. Validate input shapes
//     const validation = AdminSchema.safeParse(data);
//     if (!validation.success) {
//         return { success: false, error: "Invalid input data" };
//     }
    
//     try {
//         const cookieStore = await cookies();
//         const accessToken = cookieStore.get("access_token")?.value;
        
//         if (!accessToken) {
//             return { success: false, error: "Authentication required" };
//         }

//         const validData = validation.data;

//         // 3. Map Next.js Data to Django Data
//         const djangoPayload = {
//             username: validData.username,
//             password: validData.password,
//             email: validData.email === "" ? null : validData.email, // Django prefers null over empty string for unique emails
            
//             // AUTOMATIC BOOLEAN LOGIC:
//             is_staff: validData.role === "admin" || validData.role === "super_admin", 
//             is_superuser: validData.role === "super_admin",
            
//             // SECURITY: Ignore whatever the frontend sends for 'status'. 
//             // Enforce business logic directly: Admins are active, standard users are not.
//             is_active: validData.role !== "user", 
//         };

//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/create/`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${accessToken}`,
//             },
//             body: JSON.stringify(djangoPayload),
//         });

//         if (!response.ok) {
//             const error = await response.json();
            
//             // Safely parse Django's nested object errors (e.g., {"username": ["This field must be unique."]})
//             const errorMessage = error.error || error.detail || 
//                                  (error.username && error.username[0]) || 
//                                  (error.email && error.email[0]) || 
//                                  "Failed to create user";
                                 
//             return { success: false, error: errorMessage };
//         }

//         const result = await response.json();
//         return { success: true, user: result };

//     } catch (error) {
//         console.error("Create User Error:", error);
//         return { success: false, error: "Server connection failed" };
//     }
// }