"use server";
//The Action Taker: This handles database mutations (logging in, registering, changing passwords, destroying cookies).
import { cookies } from "next/headers";
import { forgotPasswordFormData, LoginFormData, RegisterFormData, ResetPasswordFormData } from "@/app/types/auth";
import { ActionResult } from "next/dist/shared/lib/app-router-types";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";

 // tells next.js this code MUST run securely on the server , not in the browser
 export async function registerServerAction(data : RegisterFormData){
    try{
        
        const response = await fetch('${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register/',{
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
    try{
    const response = await fetch('${process.env.NEXT_PUBLIC_API_BASE_URL}/api/api/auth/login/',{
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
        //returns the exact error from django 
        return {success : false , error: result.detail || "Invalid credentials"}; 
        
    }
//store the jwt in an HTTpOnly cookie
//this makes the token invisible to client-side JavaScript
const cookieStore = await cookies();
cookieStore.set("access_token",result.access, {
    httpOnly: true,
    secure:process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day
    path : "/",
});
return{success:true};

}catch(error){
    return {success : false , error: "Connection Failed"};
}
 };

 //logout action 

 export async function logoutAction(){
    const cookieStore = await cookies();
    const hasToken =await verifySession();
    if(hasToken){
        cookieStore.delete("access_token");
    }
    //forces the navbar to re-run verifySession() and show "login"
    revalidatePath('/','layout');
    //redirect user
    redirect('/');
 }

 //forgotPassword

 //tells the backend to send the email

 export async function forgotPasswordAction(data: forgotPasswordFormData): Promise<ActionResult>{
    try{
        const response = await fetch('${process.env.NEXT_PUBLIC_API_BASE_URL}/password_reset/',{
            method:"POST",
            headers:{
              "Content-Type":"application/json",
            },
            body: JSON.stringify({email: data.email }),
        }); 
        if(!response.ok){
            const errorData = await response.json();
            return {success:false , error : errorData.detail || "Email not found"};

        }
        return {success:true};
    }catch(e){
        return{success: false,error:"Server connection failed"};

    }

 }


 {/*reset password */}

 export async function resetPasswordAction(data: ResetPasswordFormData, token :string): Promise<ActionResult>{
   try {
    console.log("Token being sent:", token)
    const response = await fetch('${process.env.NEXT_PUBLIC_API_BASE_URL}/password_reset/confirm/',{
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
   
     const response = await fetch('${process.env.NEXT_PUBLIC_API_BASE_URL}/password_reset/validate_token/',{
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

export async function analyzeUrlAction(formData : FormData){
    //check if the user is logged in 
    const isLoggesIn = await verifySession();

    //if not logged in , redirect them to the login page
    if(!isLoggesIn){
        redirect('/auth/login?error=please_login');
    }
    //if they are logged in 
    const url = formData.get('url');
    //django api ..

}